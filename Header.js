import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render(){
    return(
      <header className="whiteframe-shadow-4dp">
      	{this.props.leftBtn}
        <h3>{this.props.title}</h3>
        {this.props.rightBtn}
      </header>
    );
  }
}

export default Header;