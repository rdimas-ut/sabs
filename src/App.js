import React, { Component } from "react";
import Header from "./components/Header"
import Content from "./components/Content"
const { ipcRenderer } = window.require('electron');

class App extends Component {
  state = {
    tab: "home",
    isAccessTokenValid: false
  };

  componentDidMount() {
    // Call the initial refreshToken
    this.refreshAccessToken();
    this.timerRefreshAccessToken = setInterval(
      () => this.refreshAccessToken(),
      3539500);
    this.timerAcessToken = setInterval(
      () => this.isAccessTokenValid(), 
      1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerAcessToken);
    clearInterval(this.timerRefreshAccessToken);
  }

  refreshAccessToken() {
    ipcRenderer.invoke('refreshAccessToken');
  }

  isAccessTokenValid () {
    ipcRenderer.invoke('isAccessTokenValid').then(async (result) => {
      let isAccessTokenValid = result;
      this.setState({isAccessTokenValid})
    })
  }

  qboSignOut = () => {
    ipcRenderer.invoke('qboSignOut');
  }

  qboSignIn = () => {
    ipcRenderer.invoke('qboSignIn');
  }

  handleTab = (newState) => {
    let tab = newState;
    this.setState({ tab });
  };

  render() {
    return (
      <React.Fragment>
        <Header tab={this.state.tab} onTab={this.handleTab} />
        <Content tab={this.state.tab} isAccessTokenValid={this.state.isAccessTokenValid} qboSignIn={this.qboSignIn} qboSignOut={this.qboSignOut} />
      </React.Fragment>
    );
  }
}

export default App;
