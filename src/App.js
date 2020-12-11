import React, { Component } from "react";
import Header from "./components/Header"
import Content from "./components/Content"

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <Header />
        <Content />
      </React.Fragment>
    );
  }
}

export default App;
