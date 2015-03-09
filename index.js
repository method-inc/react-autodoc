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

  renderPropType(propType) {
    if (typeof propType === 'undefined') {
      return;
    }

    if (Array.isArray(propType)) {
      return propType.map(p => (
        <span className={`Autodoc-type is-enum`}>{p}</span>
      ));
    }

    if (typeof propType === 'object') {
      return (
        <pre className={`Autodoc-type is-shape`}>
          {`interface ${String.fromCharCode(123)}\n`}
            {Object.keys(propType).map(function(k) {
              return [
                <span className="Autodoc-interface-key">  {k}: </span>,
                <span className={`Autodoc-interface-type Autodoc-type is-${propType[k]}`}>{propType[k]}</span>,
                '\n'
              ];
            })}
          {`${String.fromCharCode(125)}`}
        </pre>
      );
    }

    return <span className={`Autodoc-type is-${propType}`}>{propType}</span>;
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
          </tr>
        </thead>
        <tbody>
          {Object.keys(propTypes).filter(p => propTypes[p].annotation).map(p => {
            var {propType, isRequired, defaultValue} = propTypes[p].annotation;
            isRequired = isRequired ? 'Required' : 'Optional';
            return (
              <tr key={p}>
                <th className="Autodoc-property">
                  {p}
                  <span className={`Autodoc-required is-${isRequired}`}>{isRequired}</span>
                </th>
                <td>{this.renderPropType(propType)}</td>
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

