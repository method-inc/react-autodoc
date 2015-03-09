
var annotationsFor = require('./transforms/annotationsFor').annotate;
var estemplate = require('estemplate');
var prependAnnotationRequire = require('./transforms/prepend');

module.exports = {
  type: 'replace',
  enter: function(node, parent) {
    if (node.type === 'Program') {
      prependAnnotationRequire(node.body);
    }

    if (node.type === 'Property' &&
        node.key.name === 'propTypes' &&
        typeof node.value.properties !== 'undefind'
        ) {
      if (node.value.properties == undefined) {
        return node;
      }

      node.value.properties = node.value.properties.map(function(node) {
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
      });

      return node;
    }
  }
};

