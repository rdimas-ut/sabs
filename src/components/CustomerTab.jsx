import React, { Component } from "react";
import { CustomersNav, CustomerNav } from "./TabNavs";
import { PolicyModal } from "./PolicyModal";
import { CensusModal } from "./CensusModal";
import { InvoiceModal } from "./InvoiceModal";
import { myDateDisp } from "./DateHelpers";
// const { ipcRenderer } = window.require('electron');

class Customer extends Component {
  state = {
    censusModal: false,
    newCensus: true,
    selectedCensus: [],

    policiesModal: false,
    selectedPolicy: "",

    invoiceModal: false,
    selectedInvoice: "",
  };

  showCensusModal = (newCensus = true) => {
    this.setState({ censusModal: true, newCensus });
  };

  hideCensusModal = (newCensus = true) => {
    this.setState({ censusModal: false, newCensus });
  };

  showPolicyModal = () => {
    this.setState({ policiesModal: true });
  };

  hidePolicyModal = () => {
    this.setState({ policiesModal: false, selectedPolicy: "" });
  };

  showInvoiceModal = () => {
    this.setState({ invoiceModal: true });
  };

  hideInvoiceModal = () => {
    this.setState({ invoiceModal: false, selectedInvoice: "" });
  };

  renderNavBar = () => {
    const { onTabContent, tabState } = this.props;

    const NavBarProps = {
      onTabContent,
      tabState,
      showCensusModal: this.showCensusModal,
      showPolicyModal: this.showPolicyModal,
      showInvoiceModal: this.showInvoiceModal,
    };

    if (tabState[0] === ".a") {
      // Customer Tab Main Page Nav Bar
      return <CustomersNav {...NavBarProps} />;
    } else if (tabState[0] === ".b") {
      // Customer Page Nav Bar
      return <CustomerNav {...NavBarProps} />;
    } else if (tabState[0] === ".c") {
      // Reserved
    }

    return (
      <div className="MyNavBar">
        <h1>Nondefined state</h1>
      </div>
    );
  };

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

    return (
      <div className="MyContent">
        {" "}
        <h1>Nondefined state</h1>{" "}
      </div>
    );
  };

  renderActions = () => {
    return (
      <div className="MyContent">
        <h1>Actions table FFU</h1>{" "}
      </div>
    );
  };

  renderInvoices = () => {
    return (
      <div className="MyContent">
        {" "}
        <h1>Invoices state FFU</h1>{" "}
      </div>
    );
  };

  renderPolicies = () => {
    const { policies, tabState } = this.props;
    return (
      <div className="MyTable Policies">
        <div>
          <table>
            <thead>
              <tr>
                <th className="InitCell">Start Date</th>
                <th className="SecondCell">MIC</th>
                <th className="SecondCell">MGU</th>
                <th className="SecondCell">Carrier</th>
                <th className="SecondCell">Network</th>
                <th className="SecondCell">Admin/TPA</th>
              </tr>
            </thead>
          </table>
        </div>
        {policies
          .filter((pol) => pol.Customer === tabState[2])
          .map((pol) => {
            return (
              <div key={pol.PID}>
                <table>
                  <tbody>
                    <tr
                      onClick={() => {
                        this.setState({ selectedPolicy: pol });
                        this.showPolicyModal(true);
                      }}
                    >
                      <td className="InitCell">
                        {this.renderCellContent(
                          myDateDisp(pol.StartDate, true)
                        )}
                      </td>
                      <td className="SecondCell">{String(pol.MIC)}</td>
                      <td className="SecondCell">{String(pol.MGU)}</td>
                      <td className="SecondCell">{String(pol.Carrier)}</td>
                      <td className="SecondCell">{String(pol.Network)}</td>
                      <td className="SecondCell">{String(pol.AdminTPA)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    );
  };

  renderCensus = () => {
    const { census, tabState } = this.props;
    return (
      <div className="MyTable Census">
        <div>
          <table>
            <thead>
              <tr>
                <th className="CovDate">Coverage Date</th>
                <th className="Tier">EE</th>
                <th className="Tier">ES</th>
                <th className="Tier">EC </th>
                <th className="Tier">EF</th>
                <th className="Tier"></th>
              </tr>
            </thead>
          </table>
        </div>
        {census
          .filter((cen) => cen.Customer === tabState[2])
          .map((cen) => {
            return (
              <div key={cen.CovDate}>
                <table>
                  <tbody>
                    <tr
                      onClick={() => {
                        this.showCensusModal(false);
                        this.setState({ selectedCensus: cen });
                      }}
                    >
                      <td className="CovDate">
                        {this.renderCellContent(myDateDisp(cen.CovDate))}
                      </td>
                      <td className="Tier">{String(cen.EE)}</td>
                      <td className="Tier">{String(cen.ES)}</td>
                      <td className="Tier">{String(cen.EC)}</td>
                      <td className="Tier">{String(cen.EF)}</td>
                      <td className="Tier"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    );
  };

  renderCustomers = () => {
    // Customer raises errors
    const { customers, onTabContent } = this.props;
    if (!customers) {
      return <h1>No customers found/Loading</h1>;
    } else {
      return (
        <div className="MyTable Customers">
          <div>
            <table>
              <thead>
                <tr>
                  <th>Display Name</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
            </table>
          </div>
          {customers.map((cust) => {
            return (
              <div key={cust.DispName}>
                <table>
                  <tbody>
                    <tr>
                      <td
                        onClick={() =>
                          onTabContent("customerTab", [
                            ".b",
                            ".invoices",
                            cust.DispName,
                          ])
                        }
                      >
                        {this.renderCellContent(cust.DispName)}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      );
    }
  };

  renderCellContent(c) {
    if (c === null) {
      return "";
    } else {
      return c;
    }
  }

  render() {
    return (
      <div>
        {this.renderNavBar()}
        {this.renderTabContent()}
        <CensusModal
          selectedCensus={this.state.selectedCensus}
          newCensus={this.state.newCensus}
          onCensusInsert={this.props.onCensusInsert}
          tabState={this.props.tabState}
          show={this.state.censusModal}
          onHide={this.hideCensusModal}
        />
        <PolicyModal
          selectedPolicy={this.state.selectedPolicy}
          vendors={this.props.vendors}
          censuspremium={this.props.censuspremium}
          billfees={this.props.billfees}
          feespremium={this.props.feespremium}
          onPolicyInsert={this.props.onPolicyInsert}
          onPolicyDelete={this.props.onPolicyDelete}
          tabState={this.props.tabState}
          show={this.state.policiesModal}
          onHide={this.hidePolicyModal}
        />
        <InvoiceModal
          show={this.state.invoiceModal}
          onHide={this.hideInvoiceModal}
        />
      </div>
    );
  }
}

export default Customer;
