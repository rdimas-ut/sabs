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
        return <button onClick={this.qboSignIn} className="btn btn-primary"> Future Use </button>
    }

    render() { 
        return ( 
            <div>
                <h1> This page will facilitate signing into quickbooks. </h1>
                {this.renderLogIn()}
            </div>
         );
    }
}
 
export default Home;