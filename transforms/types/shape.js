/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule shape
 */

var is = require('./_util').is;
var MemberExpressionAnnotator = require('../annotators/MemberExpression');
var getValue = function(o) { return o.value; }

module.exports = {
  is: is('shape'),

  // React.PropTypes.shape({
  //   name: React.PropTypes.string,
  //   id: React.PropTypes.number
  // });
  // TODO: this could be dried up to use the core annotationsFor instead of
  // duplicating the effort
  resolve: function(o) {
    var value = o.arguments[0].properties
      .map(getValue)
      .map(MemberExpressionAnnotator)
      .map(function(c, i) {
        c[0].key = o.arguments[0].properties[i].key.name
        return c;
      });

    return {
      key: 'propType',
      value: {
        type: 'ObjectExpression',
        properties: value.map(function(v) {
          return {
            type: 'Property',
            key: {type: 'Identifier', name: v[0].key},
            value: {type: 'Literal', value: v[0].value}
          };
        })
      }
    };
  }
};

