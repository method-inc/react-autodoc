var PROP_TYPE_KEY = require('../propTypeKey');
var types = require('../types');

module.exports = function(target) {
  var propType = target.callee.property.name;
  var propName = target.arguments[0].name;

  if (typeof types[propType] === 'undefined') {
    throw new Error('Attempted to annotate unknown CallExpression ' + propType);
  }

  var annotations = types[propType].resolve(target);
  /*
  console.log(annotations);

  console.log(require('escodegen').generate(annotations));
 */

  return [annotations];
};


