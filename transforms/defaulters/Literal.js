var escodegen = require('escodegen');

module.exports = function DefaultForLiteral(node) {
  return [
    {
      type: 'Literal',
      key: 'defaultValue',
      value: node.value.toString()
    }
  ];
};

