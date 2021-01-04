import React, { Component } from 'react';
// const { ipcRenderer } = window.require('electron');

class Customer extends Component {
    state = { }

    renderNavBar = () => {
        let navLink = "nav-link nav-extra ";
        const {onTabContent, tabState} = this.props;
        var actionsClass = tabState[1] === ".actions" ? navLink + "active" : navLink + "";
        var customersClass = tabState[1] === ".customers" ? navLink + "active" : navLink + "";

        var invoicesClass = tabState[1] === ".invoices" ? navLink + "active" : navLink + "";
        var policiesClass = tabState[1] === ".policies" ? navLink + "active" : navLink + "";
        var censusClass = tabState[1] === ".census" ? navLink + "active" : navLink + "";


        if (tabState[0] === ".a") {
            // Customer Tab Main Page Nav Bar
            return  <div className="CustomerBar">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={actionsClass} onClick={() => onTabContent("customerTab", [".a", ".actions", null])} >Actions</button>
                            </li>
                            <li className="nav-item" >
                                <button className={customersClass} onClick={() => onTabContent("customerTab", [".a", ".customers", null])} >Customers</button>
                            </li>
                        </ul>
                    </div>; 
        } else if (tabState[0] === ".b") {
            // Customer Page Nav Bar
            return  <div className="CustomerBar">
                        <h1>{tabState[2]}</h1>
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button className={actionsClass} onClick={() => onTabContent("customerTab", [".b", ".actions", tabState[2]])} >Actions</button>
                            </li>
                            <li className="nav-item" >
                                <button className={invoicesClass} onClick={() => onTabContent("customerTab", [".b", ".invoices", tabState[2]])} >Invoices</button>
                            </li>
                            <li className="nav-item" >
                                <button className={policiesClass} onClick={() => onTabContent("customerTab", [".b", ".policies", tabState[2]])} >Policies</button>
                            </li>
                            <li className="nav-item" >
                                <button className={censusClass} onClick={() => onTabContent("customerTab", [".b", ".census", tabState[2]])} >Census</button>
                            </li>
                            <li className="nav-item" >
                                <button className={navLink} onClick={() => onTabContent("customerTab", [".a", ".customers", null])} >Back</button>
                            </li>
                        </ul>
                    </div>; 
        } else if (tabState[0] === ".c") {
            // Reserved
        }

        return(<div className="CustomerBar"> <h1>Nondefined state</h1> </div>);
    }

    renderTabContent = () => {
        const { tabState } = this.props;

        if (tabState[0] === ".a") {
            if (tabState[1] === ".customers") {
                return this.renderCustomers();
            } else if (tabState[1] === ".actions") {
                return this.renderActions();
            }
        } else if (tabState[0] === ".b") {
            if (tabState[1] === ".actions") {
                return this.renderActions();
            } else if (tabState[1] === ".invoices") {
                return this.renderInvoices();
            } else if (tabState[1] === ".policies") {
                return this.renderPolicies();
            } else if (tabState[1] === ".census") {
                return this.renderCensus();
            }
        } else if (tabState[0] === ".c") {
            // Reserved
        }

        return <div className="CustomerBar"> <h1>Nondefined state</h1> </div>;
    }

    renderActions = () => {
        return <div className="CustomerTable"><h1>Actions table FFU</h1> </div>;
    }

    renderInvoices = () => {
        return <div className="CustomerBar"> <h1>Invoices state FFU</h1> </div>;
    }

    renderPolicies = () => {
        return <div className="CustomerBar"> <h1>Policies state FFU</h1> </div>;
    }

    renderCensus = () => {
        return <div className="CustomerTable"><h1>Census table FFU</h1> </div>;
    }

    test = () => {
        console.log("Pressed")
    }

    renderCustomers = () => {
        // Customer raises errors
        const {customers, onTabContent} = this.props;
        if (!customers) {
            return <h1>No customers found/Loading</h1>
        } else {
            return (
                <div className="CustomerTable">
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Display Name</th>
                                    <th>Actionables</th>
                                    <th>Last Actual Census</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    {customers.map(cust => { return(
                        <div key={cust.DispName}>
                        <table>
                        <tbody>
                            <tr>                                                      
                                <td className="mytd" onClick={() => onTabContent("customerTab", [".b", ".actions", cust.DispName])}>{this.renderCellContent(cust.DispName)}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                        </table>
                        </div>
                    )})}
                </div>
            );
        }
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
                {this.renderTabContent()}
            </div>
        );
    }
}
 
export default Customer;