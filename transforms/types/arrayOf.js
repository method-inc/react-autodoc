/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule arrayOf
 */

var is = require('./_util').is;
function value(o) { return o.value; }

module.exports = {
  is: is('arrayOf'),

  // React.PropTypes.arrayOf(React.propTypes.string)
  // React.PropTypes.arrayOf(React.propTypes.number).isRequired
  resolve: function(o) {
    var result = require('../annotators/MemberExpression')(o.arguments[0])[0];
    result.value = result.value + '[]';

    return result;
  }
};



