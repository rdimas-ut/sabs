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

  handlePolicySubmit = async (Customer, Params) => {
    console.log(Customer);
    console.log(Params);
    const PID = Date.now();

    const InsertPolicy = {
      PID: PID,
      Customer: Customer,
      MGU: Params.formMGU,
      Carrier: Params.formCarrier,
      Network: Params.formNetwork,
      AdminTPA: Params.formAdminTPA,
      MIC: Params.formMIC,
      StartDate: Params.formStartDate,
      Source: Params.newsource,
    };

    await ipcRenderer.invoke("insert", "Policy", InsertPolicy);

    const InsertSpecRate = {
      PID: PID,
      TierStruc: Params.SpecStruc,
      Type: "Aggregate",
      EE: Params.formSpecEE,
      ES: Params.formSpecES,
      EC: Params.formSpecEC,
      EF: Params.formSpecEF,
    };

    await ipcRenderer.invoke("insert", "CensusPremium", InsertSpecRate);

    const InsertAggRate = {
      PID: PID,
      TierStruc: Params.AggStruc,
      EE: Params.formAggEE,
      ES: Params.formAggES,
      EC: Params.formAggEC,
      EF: Params.formAggEF,
    };

    await ipcRenderer.invoke("insert", "CensusPremium", InsertAggRate);

    var i;
    for (i = 0; i < Params.PremiumFees.length; i++) {
      if (
        Params.PremiumFees[i].formPremFeeCalMethod &&
        Params.PremiumFees[i].formPremFeeRate &&
        Params.PremiumFees[i].formPremFeeVendor
      ) {
        var InsertFeesPremium = {
          PID: PID,
          Vendor: Params.PremiumFees[i].formPremFeeVendor,
          Calc: Params.PremiumFees[i].formPremFeeCalMethod,
          Rate: Params.PremiumFees[i].formPremFeeRate,
        };

        await ipcRenderer.invoke("insert", "FeesPremium", InsertFeesPremium);
      }
    }
    for (i = 0; i < Params.VendorFees.length; i++) {
      if (
        Params.VendorFees[i].formVendorFeeCalMethod &&
        Params.VendorFees[i].formVendorFeeRate &&
        Params.VendorFees[i].formVendorFeeVendor
      ) {
        var InsertBillFees = {
          PID: PID,
          Vendor: Params.VendorFees[i].formVendorFeeVendor,
          Calc: Params.VendorFees[i].formVendorFeeCalMethod,
          Rate: Params.VendorFees[i].formVendorFeeRate,
        };

        await ipcRenderer.invoke("insert", "BillFees", InsertBillFees);
      }
    }

    console.log("Finished handle");
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

    if (res.length == 1 && New) {
      this.showErrorModal(
        "Census Error",
        "An entry for this month already exist."
      );
    } else {
      await ipcRenderer.invoke("insert", "CensusLog", Params);
      await this.getCensus();
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
      customerTab,
      vendorTab,
    } = this.state;
    const cProps = {
      policies,
      customers,
      census,
      onTabContent: this.handleTabContent,
      tabState: customerTab,
      onCensusInsert: this.handleCensusInsert,
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

    const censusFunctions = {
      onPolicySubmit: this.handlePolicySubmit,
    };

    const { tab } = this.state;
    const com = [
      <Home {...testButtons} />,
      <Customer {...censusFunctions} {...cProps} />,
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
