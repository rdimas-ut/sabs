import React, { Component } from "react";
import { VendorsNav, VendorNav } from "./TabNavs";

class Vendor extends Component {
  state = {};

  renderBills = () => {
    return (
      <div className="MyContent">
        <h1>Bills state FFU</h1>
      </div>
    );
  };

  renderVendors = () => {
    // Customer raises errors
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
        {this.props.vendors.map((vendor) => {
          return (
            <div key={vendor.DispName}>
              <table>
                <tbody>
                  <tr>
                    <td
                      onClick={() =>
                        this.props.onTabContent("vendorsTab", [
                          "b",
                          "bills",
                          vendor.DispName,
                        ])
                      }
                    >
                      {vendor.DispName}
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
  };

  render() {
    const { tabState, onTabContent } = this.props;

    return (
      <React.Fragment>
        {tabState[0] === "a" && (
          <VendorsNav onTabContent={onTabContent} tabState={tabState} />
        )}
        {tabState[0] === "b" && (
          <VendorNav onTabContent={onTabContent} tabState={tabState} />
        )}

        {tabState[0] === "a" &&
          tabState[1] === "vendors" &&
          this.renderVendors()}
        {tabState[0] === "b" && tabState[1] === "bills" && this.renderBills()}
      </React.Fragment>
    );
  }
}

export default Vendor;
