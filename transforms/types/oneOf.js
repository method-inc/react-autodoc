/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule oneOf
 */

function value(o) { return o.value; }

module.exports = {
  is: function(o) {
    return (
      typeof o === 'object' &&
      o.type === 'CallExpression' &&
      o.callee.property.name === 'oneOf'
    );
  },

  resolve: function(o) {
    // TODO: if this is a variable reference instead of inline
    // we’ll need to look it up
    var elements = o.arguments[0].elements;
    return {
      key: 'propType',
      value: 'enum <' + elements.map(value).join(' | ') + '>'
    };
  }

};

