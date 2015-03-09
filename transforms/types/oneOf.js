/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule oneOf
 */

var is = require('./_util').is;
function value(o) { return o.value; }

module.exports = {
  is: is('oneOf'),

  // React.PropTypes.oneOf(Thing);
  resolve: function(o) {
    // TODO: if this is a variable reference instead of inline
    // we’ll need to look it up
    var elements = JSON.parse(JSON.stringify(o.arguments[0].elements));
    return {
      key: 'propType',
      value: {
        type: 'ArrayExpression',
        elements: elements,
      }
    };
  }
};

