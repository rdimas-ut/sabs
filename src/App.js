import React, { Component } from "react";
import Sidebar from "./components/Sidebar"
import Content from "./components/Content"
import "bootstrap/dist/css/bootstrap.css";
const { ipcRenderer } = window.require('electron');

class App extends Component {
  state = {
    tab: "home",
    qbo: false,
    // Tab data needed
    customers: null,
    vendors: null,
    // Tab state as define by two var
    customerTab: [".a", ".customers", ""],
    vendorTab: [".a",".vendors", ""]
  };

  componentDidMount() {
    // Call the initial refreshToken
    // this.refreshAccessToken();
    // this.timerRefreshAccessToken = setInterval(
    //   () => this.refreshAccessToken(),
    //   3539500);
    // this.timerAcessToken = setInterval(
    //   () => this.isAccessTokenValid(), 
    //   1000);
    
    // Load the customer information
    this.refreshCustomerDB();
  };

  refreshCustomerDB = () => {
    ipcRenderer.invoke('testSQLITE').then((result)=> {
      var i;
      for (i = 0; i < result.length; i++) {
          console.log(result[i].DispName);
      }
      this.setState({tabData: this.state.tabData, customers: result})
    });
  };

  // componentWillUnmount() {
  //   clearInterval(this.timerAcessToken);
  //   clearInterval(this.timerRefreshAccessToken);
  // };

  // refreshAccessToken() {
  //   ipcRenderer.invoke('refreshAccessToken');
  // };

  // isAccessTokenValid () {
  //   ipcRenderer.invoke('isAccessTokenValid').then((result) => {
  //     let isAccessTokenValid = result;
  //     this.setState({isAccessTokenValid})
  //   })
  // };

  handleTab = (tab) => {
    this.setState({ tab });
  };

  handleTabContent = (tab, tabState) => {
    if (tab === "customerTab") {
      this.setState({customerTab:tabState})
    } else if (tab === "vendorTab") {
      this.setState({vendorTab:tabState})
    }
  };

  render() {
    const {tab, customers, vendors, customerTab, vendorTab} = this.state;
    const tabData = {
      customers: customers,
      vendors: vendors
    }
    const tabState = {
      customerTab: customerTab,
      vendorTab: vendorTab
    };

    
    return (
      <React.Fragment>
        <Sidebar tab={tab} onTab={this.handleTab} />
        <Content tab={tab} tabState={tabState} tabData={tabData} onTabContent={this.handleTabContent} />
      </React.Fragment>
    );
  }
}

export default App;
