import React, { Component } from "react";

class Home extends Component {
  state = {};

  render() {
    const {
      qboSignIn,
      qboSignOut,
      refreshCustomer,
      refreshVendor,
    } = this.props;
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
            <button onClick={refreshCustomer} className="btn btn-primary">
              Refresh Customer
            </button>
          </div>
          <div className="MyFormButton">
            <button onClick={refreshVendor} className="btn btn-primary">
              Refresh Vendor
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
