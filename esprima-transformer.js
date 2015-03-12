
var annotationsFor = require('./transforms/annotationsFor').annotate;
var estemplate = require('estemplate');
var prependAnnotationRequire = require('./transforms/prepend');

function isClassic(node) {
  return (
    node.type === 'Property' &&
    node.key.name === 'propTypes' &&
    typeof node.value.properties !== 'undefined'
  );
}

function isModern(node, parent) {
  return (
    node.type === 'MemberExpression' &&
    node.property.name === 'propTypes' &&
    parent.right && typeof parent.right.properties !== 'undefined'
  );
}

function annotate(node) {
  node.value = estemplate(
    'AnnotatePropTypes(' +
      '<%= propTypes %>, ' +
      '<%= annotation %>' +
    ')', {
      propTypes: node.value,
      annotation: annotationsFor(node)
    }
  );

  node.value = node.value.body[0].expression;
  return node;
}

module.exports = {
  type: 'replace',
  enter: function(node, parent) {
    if (node.type === 'Program') {
      prependAnnotationRequire(node.body);
    }

    if (isClassic(node)) {
      node.value.properties = node.value.properties.map(annotate);
      return node;
    }
    else if (isModern(node, parent)) {
      parent.right.properties = parent.right.properties.map(annotate);
      return node;
    }
  }
};

