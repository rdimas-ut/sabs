import React, { Component } from "react";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import "bootstrap/dist/css/bootstrap.css";
const { ipcRenderer } = window.require("electron");

class App extends Component {
  state = {
    tab: "home",
    qbo: false,
    appstate: null,
    // Tab data needed
    customers: [],
    vendors: [],
    policies: [],
    census: [],
    // Tab state as define by two var
    customerTab: [".a", ".customers", ""],
    vendorTab: [".a", ".vendors", ""],
  };

  componentDidMount() {
    // Load the customer information
    this.getState();
    this.getCustomers();
    this.getVendors();
    this.getPolicies();
    this.getCensus();
    this.timerQBO = setInterval(() => this.isUserSignedInToQBO(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerQBO);
  }

  handleCensusSubmit = async (Customer, Status, Params) => {
    const { census } = this.state;
    var commd =
      'select EC, EE, EF, ES from Census where Status = "Actual" and CovDate = ';
    const DTS = Math.floor(Date.now() / 1000);
    console.log(Params.CovDate);

    if (Params.CovDate) {
      commd += String(Params.CovDate);
      const CensusByDate = await ipcRenderer.invoke("execute", commd);
      console.log(CensusByDate);
    }

    console.log(Params);
  };

  qboSignIn = () => {
    ipcRenderer.invoke("qboSignIn");
  };

  qboSignOut = async () => {
    await ipcRenderer.invoke("qboSignOut");
    this.getState();
  };

  refreshCustomer = async () => {
    await ipcRenderer.invoke("refreshCustomer");
    this.getCustomers();
  };

  refreshVendor = async () => {
    await ipcRenderer.invoke("refreshVendor");
    this.getVendors();
  };

  getState = async () => {
    try {
      const result = await ipcRenderer.invoke("getState");
      this.setState({ appstate: result });
    } catch (err) {
      console.log(err);
    }
  };

  getCustomers = async () => {
    try {
      const result = await ipcRenderer.invoke("getCustomers");
      this.setState({ customers: result });
    } catch (e) {
      console.log(e);
    }
  };

  getVendors = async () => {
    try {
      const result = await ipcRenderer.invoke("getVendors");
      this.setState({ vendors: result });
    } catch (err) {
      console.error(err);
    }
  };

  getPolicies = async () => {
    try {
      const result = await ipcRenderer.invoke("getPolicies");
      this.setState({ policies: result });
    } catch (err) {
      console.error(err);
    }
  };

  getCensus = async () => {
    try {
      const result = await ipcRenderer.invoke("getCensus");
      this.setState({ census: result });
    } catch (err) {
      console.error(err);
    }
  };

  isUserSignedInToQBO = () => {
    const { appstate } = this.state;
    try {
      const rf_expire_date =
        appstate.date_created + appstate.x_refresh_token_expires_in;
      const qbo = rf_expire_date > Math.floor(Date.now() / 1000);
      console.log(qbo);
      this.setState({ qbo });
    } catch (err) {
      console.log("App State has not been retrieved!");
    }
  };

  handleTab = (tab) => {
    this.setState({ tab });
  };

  handleTabContent = (tab, tabState) => {
    if (tab === "customerTab") {
      this.setState({ customerTab: tabState });
    } else if (tab === "vendorTab") {
      this.setState({ vendorTab: tabState });
    }
  };

  render() {
    const { tab } = this.state;
    const tabData = {
      customers: this.state.customers,
      vendors: this.state.vendors,
      policies: this.state.policies,
      censusu: this.state.census,
    };
    const tabState = {
      customerTab: this.state.customerTab,
      vendorTab: this.state.vendorTab,
    };

    const testButtons = {
      qboSignOut: this.qboSignOut,
      qboSignIn: this.qboSignIn,
      refreshVendor: this.refreshVendor,
      refreshCustomer: this.refreshCustomer,
    };

    const censusFunctions = {
      onCensusSubmit: this.handleCensusSubmit,
    };

    return (
      <React.Fragment>
        <Sidebar tab={tab} onTab={this.handleTab} />
        <Content
          censusFunctions={censusFunctions}
          testButtons={testButtons}
          tab={tab}
          tabState={tabState}
          tabData={tabData}
          onTabContent={this.handleTabContent}
        />
      </React.Fragment>
    );
  }
}

export default App;
