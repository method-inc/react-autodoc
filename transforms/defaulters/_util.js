var escodegen = require('escodegen');

module.exports = {
  toCode: function(node) {
    return [
      {
        type: 'Literal',
        key: 'defaultValue',
        value: escodegen.generate(node)
      }
    ];
  }
};

