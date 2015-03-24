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
var defaulters = require('./defaulters');

/**
 * Get the AST representation of a nodes propTypes definition
 */
function _(type, node) {
  var target = node.value;
  var t = type[target.type] ? target.type : 'defaults'
  if (typeof type[t] !== 'function') {
    console.warn(
      'Attempted to annotate unsupported node type ' + target.type
    );
    return null;
  }

  return type[t](target);
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
    return (_(annotators, node) || []).reduce(function(o, k) {
      o[k.key] = transform(k.value);
      return o;
    }, {});
  },

  annotate: function annotationsFor(node) {
    var annotations = _(annotators, node);
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
            a.value :
            {
              type: 'Literal',
              value: a.value
            }
        };
      })
    };
  },

  defaults: function defaultsFor(node) {
    var defaults = _(defaulters, node);
    return {
      type: 'ObjectExpression',
      properties: [{
        type: 'Property',
        key: {
          type: 'Identifier',
          name: 'defaultValue',
        },
        value: (typeof defaults.value === 'object') ?
          defaults.value : {
            type: 'Literal',
            value: defaults
          }
      }]
    };
  },
};

