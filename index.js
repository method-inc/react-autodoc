"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* @flow */
require("./styles.css");

var React = require("react");

var Autodoc = React.createClass({
  displayName: "Autodoc",

  renderDocs: function renderDocs() {
    var docString = this.props.component.docString;

    if (typeof docString === "undefined") {
      return null;
    }return React.createElement(
      "p",
      { className: "Autodoc-description" },
      docString
    );
  },

  renderPropType: function renderPropType(propType) {
    if (typeof propType === "undefined") {
      return;
    }

    if (Array.isArray(propType)) {
      return propType.map(function (p) {
        return React.createElement(
          "span",
          { className: "Autodoc-type is-enum" },
          p
        );
      });
    }

    if (typeof propType === "object") {
      return React.createElement(
        "pre",
        { className: "Autodoc-type is-shape" },
        "interface " + String.fromCharCode(123) + "\n",
        Object.keys(propType).map(function (k) {
          return [React.createElement(
            "span",
            { className: "Autodoc-interface-key" },
            "  ",
            k,
            ": "
          ), React.createElement(
            "span",
            { className: "Autodoc-interface-type Autodoc-type is-" + propType[k] },
            propType[k]
          ), "\n"];
        }),
        "" + String.fromCharCode(125)
      );
    }

    return React.createElement(
      "span",
      { className: "Autodoc-type is-" + propType },
      propType
    );
  },

  renderProps: function renderProps() {
    var _this = this;

    var propTypes = this.props.component.propTypes;

    if (typeof propTypes === "undefined") {
      return null;
    }return React.createElement(
      "table",
      _extends({ className: "Autodoc-table" }, this.props),
      React.createElement(
        "thead",
        null,
        React.createElement(
          "tr",
          null,
          React.createElement(
            "td",
            null,
            "Property"
          ),
          React.createElement(
            "td",
            null,
            "Type"
          )
        )
      ),
      React.createElement(
        "tbody",
        null,
        Object.keys(propTypes).filter(function (p) {
          return propTypes[p].annotation;
        }).map(function (p) {
          var _propTypes$p$annotation = propTypes[p].annotation;
          var propType = _propTypes$p$annotation.propType;
          var isRequired = _propTypes$p$annotation.isRequired;
          var defaultValue = _propTypes$p$annotation.defaultValue;

          isRequired = isRequired ? "Required" : "Optional";
          return React.createElement(
            "tr",
            { key: p },
            React.createElement(
              "th",
              { className: "Autodoc-property" },
              p,
              React.createElement(
                "span",
                { className: "Autodoc-required is-" + isRequired },
                isRequired
              )
            ),
            React.createElement(
              "td",
              null,
              _this.renderPropType(propType)
            ),
            React.createElement(
              "td",
              { className: "Autodoc-default" },
              defaultValue
            )
          );
        })
      )
    );
  },

  render: function render() {
    var displayName = this.props.component.displayName;

    return React.createElement(
      "div",
      { className: "Autodoc" },
      React.createElement(
        "h2",
        { className: "Autodoc-title" },
        "Autodoc for ",
        displayName
      ),
      this.renderDocs(),
      this.renderProps()
    );
  }

});

module.exports = Autodoc;

