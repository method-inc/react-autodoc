/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule _util
 */

module.exports = {
  is: function(propTypeName) {
    return function() {
      return (
        typeof o === 'object' &&
        o.type === 'CallExpression' &&
        o.callee.property.name === propTypeName
      )
    }
  }
};

