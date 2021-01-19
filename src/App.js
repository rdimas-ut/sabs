import React, { Component } from "react";
import Sidebar from "./components/Sidebar";
import "bootstrap/dist/css/bootstrap.css";

import "./components/styles.css";
import "./components/mystyles.css";
import Home from "./components/HomeTab";
import Customer from "./components/CustomerTab";
import Vendor from "./components/VendorTab";
import { ErrorModal } from "./components/ExtraModals";

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
    censuspremium: [],
    feespremium: [],
    billfees: [],
    // Tab state as define by two var
    customerTab: [".a", ".customers", ""],
    vendorTab: [".a", ".vendors", ""],

    errorModal: false,
    errorModalTitle: "",
    errorModalMessage: "",
  };

  componentDidMount() {
    // Load the customer information
    this.getState();
    this.getCustomers();
    this.getVendors();
    this.getPolicies();
    this.getCensus();
    this.getCensusPremium();
    this.getFeesPremium();
    this.getBillFees();
    this.timerQBO = setInterval(() => this.isUserSignedInToQBO(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerQBO);
  }

  showErrorModal = (errorTitle, errorMessage) => {
    this.setState({
      errorModal: true,
      errorModalTitle: errorTitle,
      errorModalMessage: errorMessage,
    });
  };

  hideErrorModal = () => {
    this.setState({ errorModal: false });
  };

  handlePolicyInsert = async (
    PolicyParams,
    CensusPremiumParams,
    FeesPremiumParams,
    BillFeesParams
  ) => {
    try {
      const selectPolicy =
        "select * from Policy where PID = " + String(PolicyParams.PID);

      const cpol = await ipcRenderer.invoke("execute", selectPolicy);
      if (cpol.res.length > 0) {
        await ipcRenderer.invoke("delete", "Policy", { PID: PolicyParams.PID });
        await ipcRenderer.invoke("delete", "CensusPremium", {
          PID: PolicyParams.PID,
        });
        await ipcRenderer.invoke("delete", "FeesPremium", {
          PID: PolicyParams.PID,
        });
        await ipcRenderer.invoke("delete", "BillFees", {
          PID: PolicyParams.PID,
        });
      }
      await ipcRenderer.invoke("insert", "Policy", PolicyParams);

      for (const element of CensusPremiumParams) {
        await ipcRenderer.invoke("insert", "CensusPremium", element);
      }
      for (const element of FeesPremiumParams) {
        await ipcRenderer.invoke("insert", "FeesPremium", element);
      }
      for (const element of BillFeesParams) {
        await ipcRenderer.invoke("insert", "BillFees", element);
      }
      await this.getPolicies();
      await this.getCensusPremium();
      await this.getBillFees();
      await this.getFeesPremium();
    } catch (error) {
      console.log(error);
    }
  };

  handleCensusInsert = async (Params, New) => {
    var commd =
      'select EE, ES, EC, EF from Census where Status = "Actual" and Customer = "' +
      Params.Customer +
      '" and CovDate = ';
    commd += String(Params.CovDate);
    console.log(commd);
    const CensusByDate = await ipcRenderer.invoke("execute", commd);
    const res = CensusByDate.res;
    if (res.length === 1) {
      Params.EE = Number(Params.EE) - Number(res[0].EE);
      Params.ES = Number(Params.ES) - Number(res[0].ES);
      Params.EC = Number(Params.EC) - Number(res[0].EC);
      Params.EF = Number(Params.EF) - Number(res[0].EF);
    }

    if (res.length === 1 && New) {
      this.showErrorModal(
        "Census Error",
        "An entry for this month already exist."
      );
    } else {
      await ipcRenderer.invoke("insert", "CensusLog", Params);
      await this.getCensus();
    }
  };

  handlePolicyDelete = async (PID) => {
    try {
      await ipcRenderer.invoke("delete", "Policy", { PID: PID });
      await ipcRenderer.invoke("delete", "CensusPremium", {
        PID: PID,
      });
      await ipcRenderer.invoke("delete", "FeesPremium", {
        PID: PID,
      });
      await ipcRenderer.invoke("delete", "BillFees", {
        PID: PID,
      });

      await this.getPolicies();
      await this.getCensusPremium();
      await this.getBillFees();
      await this.getFeesPremium();
    } catch (error) {
      console.log(error);
    }
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

  getCensusPremium = async () => {
    const commd = "select * from CensusPremium";
    try {
      const result = await ipcRenderer.invoke("execute", commd);
      this.setState({ censuspremium: result.res });
    } catch (err) {
      console.error(err);
    }
  };

  getFeesPremium = async () => {
    const commd = "select * from FeesPremium";
    try {
      const result = await ipcRenderer.invoke("execute", commd);
      this.setState({ feespremium: result.res });
    } catch (err) {
      console.error(err);
    }
  };

  getBillFees = async () => {
    const commd = "select * from BillFees";
    try {
      const result = await ipcRenderer.invoke("execute", commd);
      this.setState({ billfees: result.res });
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

  renderContent() {
    const {
      customers,
      vendors,
      policies,
      census,
      censuspremium,
      billfees,
      feespremium,
      customerTab,
      vendorTab,
    } = this.state;
    const cProps = {
      policies,
      vendors,
      customers,
      census,
      censuspremium,
      billfees,
      feespremium,
      tabState: customerTab,
      onTabContent: this.handleTabContent,
      onCensusInsert: this.handleCensusInsert,
      onPolicyInsert: this.handlePolicyInsert,
      onPolicyDelete: this.handlePolicyDelete,
    };

    const vProps = {
      vendors,
      onTabContent: this.handleTabContent,
      tabState: vendorTab,
    };

    const testButtons = {
      qboSignOut: this.qboSignOut,
      qboSignIn: this.qboSignIn,
      refreshVendor: this.refreshVendor,
      refreshCustomer: this.refreshCustomer,
    };

    const { tab } = this.state;
    const com = [
      <Home {...testButtons} />,
      <Customer {...cProps} />,
      <Vendor {...vProps} />,
    ];

    const val = ["home", "customer", "vendor"];
    const cur = com.filter((e, index) => val[index] === tab);
    return cur[0];
  }

  render() {
    const { tab } = this.state;
    return (
      <React.Fragment>
        <Sidebar tab={tab} onTab={this.handleTab} />
        <div className="content">{this.renderContent()}</div>
        <ErrorModal
          show={this.state.errorModal}
          onHide={this.hideErrorModal}
          errorTitle={this.state.errorModalTitle}
          errorMessage={this.state.errorModalMessage}
        />
      </React.Fragment>
    );
  }
}

export default App;
