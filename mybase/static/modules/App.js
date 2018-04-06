import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return (
      <div>
        <h1>My App</h1>
        <ul role="nav">
          <li><Link to="/about" activeClassName="active-link">About</Link></li>
          <li><Link to="/contact" activeClassName="active-link">Contact</Link></li>
        </ul>

        {this.props.children}
      </div>
    )
  }
})