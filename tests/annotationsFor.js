var assert = require('assert');
var esprima = require('esprima-fb');
var annotationsFor = require('../transforms/annotationsFor');
var escodegen = require('escodegen');

function getProps(ast) {
  return ast.body[0].declarations[0].init.properties[0];
}

function test(input, expected) {
  var ast = esprima.parse(input);
  var properties = getProps(ast);

  var output = annotationsFor(properties);
  var outputSource = escodegen.generate(output).replace(/\s+/g, '');

  var expectedSource = (typeof expected === 'string' ?
    expected :
    escodegen.generate(expected)).replace(/\s+/g, '');

  assert.equal(
    outputSource,
    expectedSource,
    'expected ' + outputSource + ' to match ' + expectedSource
  );
}

function ObjectExpression() {
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


var ObjectExpressionTypes = [
  'array',
  'bool',
  'func',
  'number',
  'object',
  'string',
  'node',
  'element',
];


var CallExpressionTypes = [
  [ 'instanceOf(MyComponent)',
    '{propType: \'MyComponent\'}',
    '{propType: \'MyComponent\', isRequired: true}',
  ],
  [ 'arrayOf(React.PropTypes.string)',
    '{propType: \'string[]\'}',
    '{propType: \'string[]\', isRequired: true}',
  ],
  [ 'arrayOf(React.PropTypes.number)',
    '{propType: \'number[]\'}',
    '{propType: \'number[]\', isRequired: true}',
  ],
  ['oneOfType([React.PropTypes.string, React.PropTypes.number])',
    '{propType: [\'string\', \'number\']}',
    '{propType: [\'string\', \'number\'], isRequired: true}',
  ]
  /*
  ['oneOf(["Hello", 5])',
    '{propType: \'["Hello", 5]\'}',
    '{propType: \'["Hello", 5]\', isRequired: true}',
  ]
  */
  /*
  'objectOf(React.PropTypes.number)',
  'shape({name: React.PropTypes.string, id: React.PropTypes.number})',
 */
];

ObjectExpressionTypes.forEach(function(type) {
  test(
    'var propTypes = {prop: React.PropTypes.' + type + '};',
    ObjectExpression('propType', type)
  );

  test(
    'var propTypes = {prop: React.PropTypes.' + type + '.isRequired};',
    ObjectExpression('propType', type, 'isRequired', true)
  );
});

CallExpressionTypes.forEach(function(expr) {
  test(
    'var propTypes = {prop: React.PropTypes.' + expr[0] + '};',
    expr[1]
  );

  test(
    'var propTypes = {prop: React.PropTypes.' + expr[0] + '.isRequired};',
    expr[2]
  );
});

