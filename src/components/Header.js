import React, { Component } from 'react';
import './Header.css';

export default class Header extends Component {
  render() {
    return (
      <div className="Header">
        <nav className="navbar has-background-grey-lighter" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <strong>Knowledge Graph Visualizer</strong>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <a className="navbar-item" href="/">
                Home
              </a>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
