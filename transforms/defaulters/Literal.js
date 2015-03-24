var escodegen = require('escodegen');

module.exports = function DefaultForLiteral(node) {
  return node.value;
};


