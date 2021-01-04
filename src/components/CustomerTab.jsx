import React, { Component } from 'react';
import {CustomersNav, CustomerNav} from "./TabNavs";
import CensusModal from './CensusModal';
import PolicyModal from './PolicyModal'
// const { ipcRenderer } = window.require('electron');

class Customer extends Component {
    state = {
        censusModal: false,
        policiesModal: false
    }

    setModalShow = (mstate, modalShow) => {
        if (mstate === ".census") {
            this.setState({ censusModal: modalShow })
        } else if (mstate === ".policies") {
            this.setState({ policiesModal: modalShow })
        }
    }

    renderNavBar = () => {
        let navLink = "nav-link ";
        const {onTabContent, tabState} = this.props;

        const NavBarProps = {
            onTabContent,
            tabState,
            navLink,
            onModalShow: this.setModalShow
        }

        if (tabState[0] === ".a") {
            // Customer Tab Main Page Nav Bar
            return  <CustomersNav {...NavBarProps} />
        } else if (tabState[0] === ".b") {
            // Customer Page Nav Bar
            return <CustomerNav {...NavBarProps}  />
        } else if (tabState[0] === ".c") {
            // Reserved
        }

        return(<div className="MyNavBar"> <h1>Nondefined state</h1> </div>);
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

        return <div className="MyNavBar"> <h1>Nondefined state</h1> </div>;
    }

    renderActions = () => {
        return <div className="MyNavBar"><h1>Actions table FFU</h1> </div>;
    }

    renderInvoices = () => {
        return <div className="MyNavBar"> <h1>Invoices state FFU</h1> </div>;
    }

    renderPolicies = () => {
        return <div className="MyNavBar"> <h1>Policies state FFU</h1> </div>;
    }

    renderCensus = () => {
        return <div className="MyNavBar"><h1>Census table FFU</h1> </div>;
    }

    renderCustomers = () => {
        // Customer raises errors
        const {customers, onTabContent} = this.props;
        if (!customers) {
            return <h1>No customers found/Loading</h1>
        } else {
            return (
                <div className="MyTable">
                    <div>
                        <table><thead><tr>
                            <th>Display Name</th>
                            <th></th>
                            <th></th>        
                        </tr></thead></table>
                    </div>
                    {customers.map(cust => { return(
                        <div key={cust.DispName}>
                        <table>
                        <tbody>
                            <tr>                                                      
                                <td onClick={() => onTabContent("customerTab", [".b", ".actions", cust.DispName])}>{this.renderCellContent(cust.DispName)}</td>
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
                <CensusModal show={this.state.censusModal} onHide={() => this.setModalShow(".census", false)}/>
                <PolicyModal show={this.state.policiesModal} onHide={() => this.setModalShow(".policies", false)}/>
            </div>
        );
    }
}
 
export default Customer;