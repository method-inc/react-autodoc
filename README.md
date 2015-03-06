# react-autodoc

React autodoc is the foundation for generating the documentation for your React
Components. React provides a built-in mechanism for runtime property validation.
If you opt-in to using these, you can use this tool to automate your
documentation similar to what JSDoc provides for raw functions.

`react-autodoc` contains two pieces. The primary piece is the `Autodoc` React
component.

The second piece is opt-in. It is a webpack `esprima-loader` transformer that
will modify your source code to include the annotations that Autodoc requires.

## Example

``` javascript

// button.js
var Button = React.createClass({
  propTypes: {
    state: React.PropTypes.oneOf(['active', 'disabled', 'focused']),
    modifier: React.PropTypes.oneOf(['primary', 'secondary']).isRequired,
    children: React.PropTypes.any.isRequired,
  },

  render() {
    // using Suit.css semantics
    var uiState = this.props.state ? `is-${this.props.state}` : '';
    var modifier = this.props.modifier ? `Button--${this.props.modifier}` : '';
    return (
      <button className={`Button ${uiState} ${modifier}`}>
        {this.props.children}
      </button>
    );
  }
});

// button.autodoc.js

var React = require('react');
var Autodoc = require('react-autodoc');
var Button = require('./button');

var AutodocButton = React.createClass({
  render() {
    return (
      <Autodoc component={Button} />
    );
  }
});
```

This will produce a table that looks like a richer version of the following:


## Autodoc for Button

| Property Key | Type                          | Required | Default Value |
|--------------|-------------------------------|----------|---------------|
| state        | enum<active/disabled/focused> | false    | 'active'      |
| modifier     | enum<primary/secondary>       | true     |               |
| children     | any                           | true     |               |

---

## Why the webpack loader?

Webpack is a module loader that understands your entire dependency graph. It
also has great support for loaders and transformations for pretty much anything.

Using webpack provides the convenience of builds for different environments so
you don’t have to add the any overhead to your project in production, but can
easily include in development or qa environments.

The inline version of the propType annotations looks something like this:

```javascript
  propTypes: {
    state: (
      (var tmp = React.PropTypes.oneOf(['active', 'disabled', 'focused'])),
      tmp.annotations = {type: 'enum<active|disabled|focused>'}, tmp
    ),
    modifier: (
      (var tmp = React.PropTypes.oneOf(['primary', 'secondary']).isRequired),
      tmp.annotations = {type: 'enum<primary|secondary>', isRequired: true}, tmp
    ),
    children: (
      (var tmp = React.PropTypes.any.isRequired),
      (tmp.annotations = {type: 'any', isRequired: true}), tmp
    )
  }
```

Alternatives to inline annotations that can still be explored are:

1. Output the annotated date to a dynamic file for `react-autodoc` which
  can resolve the annotations by looking up a given `ReactComponent.displayName`.
2. Monkey patching React.PropTypes with runtime hints to what properties are
  available. Some immediate trade-offs is we can’t provide rich views into
  `CallExpression` propTypes such as `oneOf` or `shape`.

## MIT License

Copyright 2015 Skookum Digital Works, Inc. All Right Reserved

