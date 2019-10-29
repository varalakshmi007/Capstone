import React, { Component } from 'react';

export class BackButton extends Component {
  static contextTypes = {
    router: () => null, // replace with PropTypes.object if you use them
  }

  render() {
    return (
      <a className="btn" onClick={this.context.router.history.goBack}>
        <i className="fa fa-chevron-left"></i> Back
      </a>
    )
  }
}