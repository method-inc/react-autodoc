/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule annotate
 */

/**
 * Annotate a given object
 * @param {function} propDef React.PropTypes.*
 * @param {Object} annotations Autodoc annotations
 * @example
 *
 * annotate(
 *   React.PropTypes.string.isRequired,
 *   { type: 'string',
 *     isRequired: true,
 *     defaultValue: 'Hello',
 *     name: 'Salutations'
 *   }
 */
module.exports = function annotate(propDef, annotations) {
  propDef.annotation = annotations;
  return propDef;
};
