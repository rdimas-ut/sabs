import React, { Component } from "react";
import Header from "./components/Header"
import Content from "./components/Content"

class App extends Component {
  state = {
    tab: "home"
  };

  handleTab = (newState) => {
    console.log("This will chnage the seleciton on the conetent");
    const tab = newState;
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
