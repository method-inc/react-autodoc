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
  var outputSource = escodegen.generate(output);

  var expectedSource = escodegen.generate(expected);
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
  'instanceOf',
  'oneOf',
  'oneOfType',
  'arrayOf',
  'objectOf',
  'shape',
];


ObjectExpressionTypes.forEach(function(type) {
  test(
    'var propTypes = {str: React.PropTypes.' + type + '};',
    ObjectExpression('propType', type)
  );

  test(
    'var propTypes = {str: React.PropTypes.' + type + '.isRequired};',
    ObjectExpression('propType', type, 'isRequired', true)
  );
});

