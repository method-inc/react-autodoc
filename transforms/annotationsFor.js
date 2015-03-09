/**
 * Copyright 2015, Skookum Digital Works, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule annotationsFor
 */
var oneOf = require('./types/oneOf');

var annotators = require('./annotators');

module.exports = {
  annotate: function annotationsFor(node) {
    var target = node.value;
    if (typeof annotators[target.type] !== 'function') {
      throw new Error(
        'Attempted to annotate unsupported node type ' + target.type
      );
    }

    var annotations = annotators[target.type](target);

    return {
      type: 'ObjectExpression',
      properties: annotations.map(function(a) {
        return {
          type: 'Property',
          key: {
            type: 'Identifier',
            name: a.key,
          },
          value: (typeof a.value === 'object') ?
            a.value : {
              type: 'Literal',
              value: a.value
            }
        };
      })
    }
  }
};

