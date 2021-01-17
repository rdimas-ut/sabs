import "./styles.css";
import "./mystyles.css";
import React, { Component } from "react";
import Home from "./HomeTab";
import Customer from "./CustomerTab";
import Vendor from "./VendorTab";

class Content extends Component {
  state = {};

  renderContent() {
    const {
      tab,
      tabData,
      tabState,
      onTabContent,
      testButtons,
      censusFunctions,
    } = this.props;
    const com = [
      <Home {...testButtons} />,
      <Customer
        {...censusFunctions}
        policies={tabData.policies}
        customers={tabData.customers}
        census={tabData.census}
        onTabContent={onTabContent}
        tabState={tabState.customerTab}
      />,
      <Vendor
        vendors={tabData.vendors}
        onTabContent={onTabContent}
        tabState={tabState.vendorTab}
      />,
    ];

    const val = ["home", "customer", "vendor"];
    const cur = com.filter((e, index) => val[index] === tab);
    return cur[0];
  }

  // Conditionally render something here depending on the props passed
  render() {
    return <div className="content">{this.renderContent()}</div>;
  }
}

export default Content;
