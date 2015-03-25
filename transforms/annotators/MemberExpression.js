var PROP_TYPE_KEY = require('../propTypeKey');

/**
 * Resolve annotations for member expressions
 *
 * @param {ASTNode} target
 * @return {Array} annotations
 */
module.exports = function MemberExpressionAnnotator(target) {
  var annotations = [];
  var propName = target.property.name;

  // resolve the MemberExpression or CallExpression preceding the isRequired
  // React.PropTypes.type.isRequired
  // React.PropTypes.callExpressoin(arguments).isRequired
  if (propName === 'isRequired') {
    if (target.object) {
      annotations = annotations.concat(require('./' + target.object.type)(target.object));
    }

    annotations.push({
      key: propName,
      value: true,
    });
  }
  else {
    annotations.push({
      key: PROP_TYPE_KEY,
      value: propName,
    });
  }

  return annotations;
};

