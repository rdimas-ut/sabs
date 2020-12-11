import "./styles.css";
import React, { Component } from 'react';
import SABSLogo from "./SABS Logo.svg"

class Header extends Component {
    render() { 
        return (
            <div className="sidebar">
                <img class="displayed" src={SABSLogo} alt="Some text"/>

                <button type="button">Home</button>
                <button type="button">Customers</button>
                <button type="button">Vendors</button>
                <button type="button">Dashboard</button>
            </div>
          );
    }
}

export default Header;


