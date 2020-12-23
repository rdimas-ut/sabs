import React, { Component } from "react";
import Header from "./components/Header"
import Content from "./components/Content"
import "bootstrap/dist/css/bootstrap.css";
const { ipcRenderer } = window.require('electron');


class App extends Component {
  state = {
    tab: "home",
    isAccessTokenValid: false
  };

  // componentDidMount() {
  //   // Call the initial refreshToken
  //   this.refreshAccessToken();
  //   this.timerRefreshAccessToken = setInterval(
  //     () => this.refreshAccessToken(),
  //     3539500);
  //   this.timerAcessToken = setInterval(
  //     () => this.isAccessTokenValid(), 
  //     1000);
  // };

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

  handleTab = (newState) => {
    let tab = newState;
    this.setState({ tab });
  };

  render() {
    return (
      <React.Fragment>
        <Header tab={this.state.tab} onTab={this.handleTab} />
        <Content tab={this.state.tab} />
      </React.Fragment>
    );
  }
}

export default App;
