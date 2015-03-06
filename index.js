/* @flow */
require('./styles.css');

var React = require('react');

var Autodoc = React.createClass({

  renderDocs() {
    var {docString} = this.props.component;
    if (typeof docString === 'undefined') return null;

    return (
      <p className="Autodoc-description">{docString}</p>
    );
  },

  renderProps() {
    var {propTypes} = this.props.component;
    if (typeof propTypes === 'undefined') return null;

    return (
      <table className="Autodoc-table">
        <thead>
          <tr>
            <td>Property</td>
            <td>Type</td>
            <td>Required?</td>
          </tr>
        </thead>
        <tbody>
          {Object.keys(propTypes).filter(p => propTypes[p].annotation).map(p => {
            var {propType, isRequired, defaultValue} = propTypes[p].annotation;
            isRequired = isRequired ? 'Required' : 'Optional';
            return (
              <tr key={p}>
                <th className="Autodoc-property">{p}</th>
                <td>
                  {propType && <span className={`Autodoc-type is-${propType}`}>{propType}</span>}
                </td>
                <td>
                  <span className={`Autodoc-required is-${isRequired}`}>{isRequired}</span>
                </td>
                <td className="Autodoc-default">{defaultValue}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  },

  render() {
    var {displayName} = this.props.component;

    return (
      <div className="Autodoc">
        <h2 className="Autodoc-title">Autodoc for {displayName}</h2>
        {this.renderDocs()}
        {this.renderProps()}
      </div>
    );
  }

});

module.exports = Autodoc;

