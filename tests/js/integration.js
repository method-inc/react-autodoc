var path = require('path');
var readFile = require('fs').readFileSync;
var esprima = require('esprima-fb');
var estraverse = require('estraverse-fb');
var assert = require('assert');

var results;
var spyOnReturn = function(obj, method) {
  var orig = obj[method];
  results = [];
  obj[method] = function() {
    var result = orig.apply(obj, arguments);
    results.push(result);
    return result;
  }
}

module.exports = function(type) {
  spyOnReturn(require('../../transforms/annotationsFor'), 'extract');

  var contents = readFile(path.join(__dirname, 'fixtures', type + '.js'), 'utf8');

  var transformer = require('../../esprima-extractor');

  var ast = estraverse[transformer.type](
    esprima.parse(contents),
    transformer
  );

  // TODO: add support for default values
  var fullExamplePropTypes = {
    optionalArray: {propType: 'array'},
    optionalBool: {propType: 'bool'},
    optionalFunc: {propType: 'func'},
    optionalNumber: {propType: 'number'},
    optionalObject: {propType: 'object'},
    optionalString: {propType: 'string'},
    optionalNode: {propType: 'node'},
    optionalElement: {propType: 'element'},
    optionalMessage: {propType: 'Message'},
    optionalEnum: {propType: ['News', 'Photos']},
    optionalUnion: {propType: ['string', 'number', 'Message']},
    optionalArrayOf: {propType: 'number[]'},
    optionalObjectOf: {propType: 'number{}'},
    optionalObjectWithShape: {propType: {color: 'string', fontSize: 'number'}},
    requiredFunc: {propType: 'func', isRequired: true},
    requiredAny: {propType: 'any', isRequired: true},
  };

  var expected = {
    ClassicExample: fullExamplePropTypes,
    ModernExample: fullExamplePropTypes,
    Round2: {
      optionalArray: {propType: 'array'}
    },
  };

  if (results.length === 0) {
    throw new Error(
      'No results were parsed. Expected ' + expected.length + ' annotations.'
    );
  }

  transformer.onComplete = function(annotations) {
    Object.keys(annotations).forEach(function(displayName, i) {
      var result = annotations[displayName];
      var expect = expected[displayName];

      assert.deepEqual(
        result,
        expect,
        'Expected \n' + JSON.stringify(result) +
          ' not to be \n' + JSON.stringify(expect) +
          ' for ' + displayName
      );
    });
  };
};

