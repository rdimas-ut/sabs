import "./styles.css";
import React, { Component } from 'react';
import SABSLogo from "./SABS Logo.svg"

class Header extends Component {
    render() { 
        var homeButtonClass = this.props.tab === "home" ? "selected" : "button";
        var customerButtonClass = this.props.tab === "customer" ? "selected" : "button";
        var vendorButtonClass = this.props.tab === "vendor" ? "selected" : "button";
        var dashboardButtonClass = this.props.tab === "dashboard" ? "selected" : "button";

        return (
            <div className="sidebar">
                <img className="displayed" src={SABSLogo} alt="Some text"/>

                <button className={homeButtonClass} onClick={() => this.props.onTab("home")} >Home</button>
                <button className={customerButtonClass} onClick={() => this.props.onTab("customer")} >Customers</button>
                <button className={vendorButtonClass} onClick={() => this.props.onTab("vendor")} >Vendors</button>
                <button className={dashboardButtonClass} onClick={() => this.props.onTab("dashboard")} >Dashboard</button>
            </div>
          );
    }
}

export default Header;


