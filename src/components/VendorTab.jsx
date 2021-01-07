import React, { Component } from 'react';

class Vendor extends Component {
    state = {  }
    renderNavBar = () => {
        let navLink = "nav-link ";
        const {onTabContent, tabState} = this.props;
        var actionsClass = tabState[1] === ".actions" ? navLink + "active" : navLink + "";
        var vendorsClass = tabState[1] === ".vendors" ? navLink + "active" : navLink + "";

        var invoicesClass = tabState[1] === ".bills" ? navLink + "active" : navLink + "";
        var censusClass = tabState[1] === ".census" ? navLink + "active" : navLink + "";


        if (tabState[0] === ".a") {
            // Customer Tab Main Page Nav Bar
            return  <div className="MyNavBar">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={actionsClass} onClick={() => onTabContent("vendorTab", [".a", ".actions", ""])} >Actions</button>
                            </li>
                            <li className="nav-item" >
                                <button className={vendorsClass} onClick={() => onTabContent("vendorTab", [".a", ".vendors", ""])} >Vendors</button>
                            </li>
                            <li className="nav-item" >
                                <button className={navLink} onClick={() => onTabContent("vendorTab", [".b", ".actions", "testCustomer"])} >Vendor</button>
                            </li>
                        </ul>
                    </div>
        } else if (tabState[0] === ".b") {
            // Customer Page Nav Bar
            return  <div className="MyNavBar">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={actionsClass} onClick={() => onTabContent("vendorTab", [".b", ".actions", tabState[2]])} >Actions</button>
                            </li>
                            <li className="nav-item" >
                                <button className={invoicesClass} onClick={() => onTabContent("vendorTab", [".b", ".bills", tabState[2]])} >Bills</button>
                            </li>
                            <li className="nav-item" >
                                <button className={censusClass} onClick={() => onTabContent("vendorTab", [".b", ".census", tabState[2]])} >Census</button>
                            </li>
                            <li className="nav-item" >
                                <button className={navLink} onClick={() => onTabContent("vendorTab", [".a", ".actions", ""])} >Back</button>
                            </li>
                        </ul>
                    </div>; 
        } else if (tabState[0] === ".c") {
            // Reserved
        }

        return(<div className="CustomerBar"> <h1>Nondefined state</h1> </div>);
    }


    renderCellContent(c) {
        if (c === null) {
            return ""
        } else {
            return c
        }
    }

    render() {
        return (  
            <div>
                {this.renderNavBar()}
            </div>
        );
    }
}
 
export default Vendor;