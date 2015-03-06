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

var PROP_TYPE_KEY = 'propType';

module.exports = function annotationsFor(node) {
  var target = node.value;
  var annotations = [];
  if (target.type === 'MemberExpression') {
    var propName = target.property.name;

    // React.PropTypes.type.isRequired
    // should have a child MemberExpression so we want to grab
    // the prpoperty name from that as well
    if (propName === 'isRequired') {
      if (target.object) {
        // TODO: CallExpression's
        if (target.object.type === 'MemberExpression') {
          annotations.push({
            key: PROP_TYPE_KEY,
            value: target.object.property.name,
          });
        }
      }

      annotations.push({
        key: propName,
        value: true,
      });
    }
    else {
      annotations.push({
        key: PROP_TYPE_KEY,
        value: propName,
      });
    }
  }

  if (oneOf.is(target.object)) {
    annotations.push(oneOf.resolve(target.object));
  }

  return {
    type: 'ObjectExpression',
    properties: annotations.map(function(a) {
      return {
        type: 'Property',
        key: {
          type: 'Identifier',
          name: a.key,
        },
        value: {
          type: 'Literal',
          value: a.value
        }
      };
    })
  };
};

