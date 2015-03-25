var assert = require('assert');
var esprima = require('esprima-fb');
var escodegen = require('escodegen');
var defaultsFor = require('../transforms/annotationsFor').defaults;

var code = [
  'var defaultProps = {',
    'optionalArray: [],',
    'optionalBool: false,',
    'optionalFunc: this.props.clickHandler,',
    'optionalNumber: -1,',
    'optionalObject: {},',
    'optionalString: \'Hello, React\',',
    'optionalEnum: \'News\',',
  '};'
].join('\n');

var expectedOutputs = [
  ObjectExpression('defaultValue', '[]'),
  ObjectExpression('defaultValue', 'false'),
  ObjectExpression('defaultValue', 'this.props.clickHandler'),
  ObjectExpression('defaultValue', -1),
  ObjectExpression('defaultValue', '{}'),
  ObjectExpression('defaultValue', 'Hello, React'),
  ObjectExpression('defaultValue', 'News'),
];

var getProps = function(node) {
  return node.body[0].declarations[0].init.properties;
}

function test(node, index) {
  var expected = expectedOutputs[index];
  var output = defaultsFor(node);

  assert.deepEqual(
    output,
    expected,
    'expected \n' + JSON.stringify(output, 2) + '\n to match \n' + JSON.stringify(expected, 2)
  );
}

function ObjectExpression() {
  var o = {};
  o[arguments[0]] = arguments[1];
  return o;

  var props = Array.prototype.slice.call(arguments, 0);
  var properties = [];
  for (var i = 0; i < props.length; i += 2) {
    properties.push({
      type: 'Property',
      key: {type: 'Identifier', name: props[i]},
      value: {type: 'Literal', value: props[i + 1]}
    });
  }

  return {
    type: 'ObjectExpression',
    properties: properties
  };
}

var ast = esprima.parse(code);
var properties = getProps(ast);
properties.forEach(test);



