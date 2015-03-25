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

  // TODO: add support for default values
  var fullExamplePropTypes = {
    optionalArray: {propType: 'array', defaultValue: '[]'},
    optionalBool: {propType: 'bool', defaultValue: 'false'},
    optionalFunc: {propType: 'func', defaultValue: 'this.props.clickHandler'},
    optionalNumber: {propType: 'number', defaultValue: -1},
    optionalObject: {propType: 'object', defaultValue: '{}'},
    optionalString: {propType: 'string', defaultValue: 'Hello, React'},
    optionalNode: {propType: 'node'},
    optionalElement: {propType: 'element'},
    optionalMessage: {propType: 'Message'},
    optionalEnum: {propType: ['News', 'Photos'], defaultValue: 'News'},
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
      optionalArray: {propType: 'array', defaultValue: '[]'},
      optionalBool: {defaultValue: 'false'},
      optionalFunc: {defaultValue: 'this.props.clickHandler'},
      optionalNumber: {defaultValue: -1},
      optionalObject: {defaultValue: '{}'},
      optionalString: {defaultValue: 'Hello, React'},
      optionalEnum: {defaultValue: 'News'},
    },
  };

  transformer.onComplete = function(annotations) {
    Object.keys(annotations).forEach(function(displayName, i) {
      var result = annotations[displayName];
      var expect = expected[displayName];

      assert.deepEqual(
        result,
        expect,
        '\nExpectations for ' + displayName + ': \n' +
          JSON.stringify(result) +
          ' not to be: \n' + JSON.stringify(expect)
      );
    });
  };

  var ast = estraverse[transformer.type](
    esprima.parse(contents),
    transformer
  );

  if (results.length === 0) {
    throw new Error(
      'No results were parsed. Expected ' + expected.length + ' annotations.'
    );
  }

};

