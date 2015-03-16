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

/**
 * Get the AST representation of a nodes propTypes definition
 */
function _(node) {
  var target = node.value;
  if (typeof annotators[target.type] !== 'function') {
    console.warn(
      'Attempted to annotate unsupported node type ' + target.type
    );
    return null;

    throw new Error(
      'Attempted to annotate unsupported node type ' + target.type
    );
  }

  return annotators[target.type](target);
}

/**
 * Transform the AST back to it’s object representative.
 */
function transform(value) {
  var type = typeof value;
  // primitive types are ready to go
  if (
    type === 'string' ||
    type === 'boolean' ||
    type === 'number'
  ) return value;

  if (value.type === 'Literal') {
    return value.value;
  }

  if (value.type === 'ArrayExpression') {
    return value.elements.map(function(e) {
      return transform(e.value);
    });
  }

  if (value.type === 'ObjectExpression') {
    return value.properties.reduce(function(o, k) {
      o[k.key.name] = transform(k.value);
      return o;
    }, {});
  }
}

module.exports = {
  // convert the AST back to it’s real JS object representation
  extract: function extract(node) {
    return (_(node) || []).reduce(function(o, k) {
      o[k.key] = transform(k.value);
      return o;
    }, {});
  },

  annotate: function annotationsFor(node) {
    var annotations = _(node);
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
  },

};

