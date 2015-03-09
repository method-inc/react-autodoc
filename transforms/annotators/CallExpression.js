var PROP_TYPE_KEY = require('../propTypeKey');

module.exports = function(target) {
  var annotations = [];
  var propName = target.arguments[0].name;

  // React.PropTypes.type.isRequired
  // should have a child MemberExpression so we want to grab
  // the prpoperty name from that as well
  if (propName === 'isRequired') {
    /*
    if (target.object) {
      // TODO: CallExpression's
      if (target.object.type === 'MemberExpression') {
        annotations.push({
          key: PROP_TYPE_KEY,
          value: target.object.property.name,
        });
      }
    }
    */

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

  return annotations;
};


