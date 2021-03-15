import React, { Component } from "react";
import { VendorsNav, VendorNav } from "./TabNavs";
import { BillModal } from "./BillModal";
import { myDateDisp } from "./DateHelpers";

class Vendor extends Component {
  state = {
    billModal: false,
    selectedBill: "",
  };

  renderBills = () => {
    const { tabState, bill } = this.props;
    return (
      <div className="MyTable Invoice">
        <div>
          <table>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>Total Due</th>
                <th>Balance</th>
              </tr>
            </thead>
          </table>
        </div>
        {bill
          .filter((bi) => bi.Customer === tabState[2])
          .map((bi) => {
            return (
              <div key={bi.BID}>
                <table>
                  <tbody>
                    <tr
                      onClick={() => {
                        console.log("Hello");
                      }}
                    >
                      <td>{myDateDisp(parseInt(bi.BillNum))}</td>
                      <td>{String(bi.TotalDue)}</td>
                      <td>{String(bi.Balance)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    );
  };

  showBillModal = () => {
    this.setState({ billModal: true });
  };

  hideBillModal = () => {
    this.setState({ billModal: false, selectedBill: "" });
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
          <VendorNav
            showBillModal={this.showBillModal}
            onTabContent={onTabContent}
            tabState={tabState}
          />
        )}

        {tabState[0] === "a" &&
          tabState[1] === "vendors" &&
          this.renderVendors()}
        {tabState[0] === "b" && tabState[1] === "bills" && this.renderBills()}
        <BillModal
          customer={this.props.tabState[2]}
          policies={this.props.policies}
          census={this.props.census}
          censusinvoice={this.props.censusinvoice}
          feespremium={this.props.feespremium}
          censuspremium={this.props.censuspremium}
          tabState={this.props.tabState}
          onCensusInsert={this.props.onCensusInsert}
          onInvoiceCreate={this.props.onInvoiceCreate}
          show={this.state.billModal}
          onHide={this.hideBillModal}
        />
      </React.Fragment>
    );
  }
}

export default Vendor;
