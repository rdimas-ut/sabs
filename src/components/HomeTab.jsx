import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

class Home extends Component {
    state = {  }

    qboSignIn = () => {
        ipcRenderer.invoke('qboSignIn');
    }

    qboSignOut = () => {

    }

    renderLogIn = () => {
        // Will use laters
        return <button onClick={this.qboSignIn} className="btn btn-primary"> Sign In </button>
    }

    refreshCustomer() {
        console.log("refreshCustomer")
        ipcRenderer.invoke('refreshCustomer');
    }

    refreshVendor() {
        ipcRenderer.invoke('refreshVendor');
    }

    revokeTokens() {
        ipcRenderer.invoke('revokeTokens')
    }

    render() { 
        return ( 
            <div className="FrameContent" >
                <h1> This page will facilitate signing into quickbooks. </h1>
                {this.renderLogIn()}
                <button onClick={this.refreshCustomer} className="btn btn-primary">Refresh Customer</button>
                <button onClick={this.revokeTokens} className="btn btn-primary">Sign Out</button>
                <button onClick={this.refreshVendor} className="btn btn-primary">Refresh Vendor</button>
            </div>
         );
    }
}
 
export default Home;