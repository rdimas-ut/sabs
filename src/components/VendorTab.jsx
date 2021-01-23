import React, { Component } from "react";
import { VendorsNav, VendorNav } from "./TabNavs";

class Vendor extends Component {
  state = {
    view: "main",
  };
  renderNavBar = () => {
    const { onTabContent, tabState } = this.props;

    if (tabState[0] === ".a") {
      return <VendorsNav onTabContent={onTabContent} tabState={tabState} />;
    } else if (tabState[0] === ".b") {
      // Customer Page Nav Bar
      return <VendorNav onTabContent={onTabContent} tabState={tabState} />;
    } else if (tabState[0] === ".c") {
      // Reserved
    }

    return (
      <div className="MyNavBar">
        <h1>Undefined State</h1>
      </div>
    );
  };

  renderTabContent = () => {
    const { tabState } = this.props;

    if (tabState[0] === ".a") {
      if (tabState[1] === ".vendors") {
        return this.renderVendors();
      } else if (tabState[1] === ".actions") {
        return this.renderActions();
      }
    } else if (tabState[0] === ".b") {
      if (tabState[1] === ".actions") {
        return this.renderActions();
      } else if (tabState[1] === ".bills") {
        return this.renderBills();
      } else if (tabState[1] === ".census") {
        return this.renderCensus();
      }
    } else if (tabState[0] === ".c") {
      // Reserved
    }

    return (
      <div className="MyContent">
        <h1>Nondefined state</h1>
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

  renderBills = () => {
    return (
      <div className="MyContent">
        <h1>Bills state FFU</h1>
        <button
          onClick={() => {
            this.setState({ view: "not home" });
            console.log(this.state);
          }}
        >
          Select
        </button>
      </div>
    );
  };

  renderCensus = () => {
    return (
      <div className="MyContent">
        <h1>Census table FFU</h1>{" "}
      </div>
    );
  };

  renderVendors = () => {
    // Customer raises errors
    const { vendors, onTabContent } = this.props;
    if (!vendors) {
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
          {vendors.map((vendor) => {
            return (
              <div key={vendor.DispName}>
                <table>
                  <tbody>
                    <tr>
                      <td
                        onClick={() =>
                          onTabContent("vendorTab", [
                            ".b",
                            ".bills",
                            vendor.DispName,
                          ])
                        }
                      >
                        {this.renderCellContent(vendor.DispName)}
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
      </div>
    );
  }
}

export default Vendor;
