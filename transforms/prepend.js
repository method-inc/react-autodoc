/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule prepend
 */

var esprima = require('esprima-fb');

var SOURCE_PREFIX = esprima.parse(
  '/* AUTODOC */\n' +
  'var AnnotatePropTypes = require(' +
    JSON.stringify(require.resolve('./../annotate')) +
  ');'
).body;

/**
 * Prepend the SOURCE_PREFIX to the AST program body.
 *
 * @param {Array} programBody the top level body property of an AST Program
 */
module.exports = function prepend(programBody) {
  programBody.unshift(SOURCE_PREFIX[0]);
};

