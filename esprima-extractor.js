var annotationsFor = require('./transforms/annotationsFor').extract;
var estemplate = require('estemplate');
var estraverse = require('estraverse-fb');
var prependAnnotationRequire = require('./transforms/prepend');

function isClassic(node) {
  return (
    node.type === 'CallExpression' &&
    (
      node.callee.type === 'MemberExpression' &&
      node.callee.property.name === 'createClass'
    )
  );
}

function isModern(node) {
  return (
    node.type === 'ClassDeclaration' &&
      (
        node.superClass &&
        node.superClass.type === 'MemberExpression' &&
        node.superClass.object.name === 'React' &&
        node.superClass.property.name === 'Component'
      )
  );
}

function extract(o, node) {
  o[node.key.name] = annotationsFor(node);
  return o;
}

function extractNameFromProperties(properties){
  return (find(properties, function(node) {
    return node.key.name === 'displayName';
  }) || {}).name;
}

function extractNameFromVariableDeclarator(declarator) {
  return declarator.id && declarator.id.name;
}

function find(o, fn) {
  var result;
  o.some(function(n, i) {
    if (fn.apply(null, arguments)) {
      result = n;
      return true;
    }
  });
  return result;
}

var _ReactClassDeclarations = [];
var Annotations = {};

module.exports = {
  onComplete: function() {},
  type: 'traverse',
  enter: function(node, parent) {
    if (isClassic(node)) {
      var props = node.arguments[0].properties;
      var name = (
        extractNameFromProperties(props) ||
        extractNameFromVariableDeclarator(parent)
      ) || 'INFER_FROM_FILE';

      var propTypes = find(props, function(p) {
        return p.type === 'Property' && p.key.name === 'propTypes'
      });

      if (typeof propTypes === 'undefined') {
        return estraverse.VisitorOption.Skip;
      }

      Annotations[name] = propTypes.value.properties.reduce(extract, {});

      return estraverse.VisitorOption.Skip;
    }
    else if (isModern(node)) {
      _ReactClassDeclarations.push(node.id.name);
      return estraverse.VisitorOption.Skip;
    }
    else if (
      node.type === 'MemberExpression' &&
      node.property.name === 'propTypes'
    ) {
      if (_ReactClassDeclarations.indexOf(node.object.name) === -1) {
        throw new Error(
          'Attempted to assign propTypes to unknown React Component ' +
            node.object.name
        );
      }

      Annotations[node.object.name] = parent.right.properties.reduce(extract, {});
    }
  },

  leave: function(node, parent) {
    // clean up when you leave a file
    if (node.type === 'Program') {
      module.exports.onComplete(Annotations);

      _ReactClassDeclarations = [];
      Annotations = {};
    }
  }
};


