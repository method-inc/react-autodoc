/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule oneOfType
 */

var is = require('./_util').is;
var MemberExpressionAnnotator = require('../annotators/MemberExpression');
var getValue = function(o) { return o[0].value; }

module.exports = {
  is: is('oneOfType'),

  // React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
  resolve: function(o) {
    var value = o.arguments[0];
    value = o.arguments[0].elements
      .map(MemberExpressionAnnotator)
      .map(getValue);

    return {
      key: 'propType',
      value: {
        type: 'ArrayExpression',
        elements: value.map(function(v) {
          return {type: 'Literal', value: v};
        })
      }
    };
  }
};



