import React, { Component } from "react";

class Home extends Component {
  state = {};

  render() {
    const { qboSignIn, qboSignOut, refreshQBOData } = this.props;
    return (
      <div className="MyContent">
        <h1> Quickbook Controls </h1>
        <div className="btn-group">
          <div className="MyFormButton">
            <button onClick={qboSignIn} className="btn btn-primary">
              Sign In
            </button>
          </div>
          <div className="MyFormButton">
            <button onClick={qboSignOut} className="btn btn-primary">
              Sign Out
            </button>
          </div>
          <div className="MyFormButton">
            <button onClick={refreshQBOData} className="btn btn-primary">
              Refresh QBO Data
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
