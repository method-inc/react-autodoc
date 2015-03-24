var escodegen = require('escodegen');

module.exports = {
  toCode: function(node) {
    return escodegen.generate(node);
  }
};

