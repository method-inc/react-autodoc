var PROP_TYPE_KEY = require('../propTypeKey');
var types = require('../types');

/**
 * Resolve annotations for call expressions
 *
 * @param {ASTNode} target
 * @return {Array} annotations
 */
module.exports = function CallExpressionAnnotator(target) {
  var propType = target.callee.property.name;
  var propName = target.arguments[0].name;

  if (typeof types[propType] === 'undefined') {
    throw new Error('Attempted to annotate unknown CallExpression ' + propType);
  }

  var annotations = types[propType].resolve(target);

  return Array.isArray(annotations) ? annotations : [annotations];
};


