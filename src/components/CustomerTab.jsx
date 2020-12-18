import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

class Customer extends Component {
    state = {  }
    renderCustomers = () => {
        if (this.props.isAccessTokenValid) {
            return <h1>User is signed into qbo</h1>
        } else {
            return <h1>User is not signed into qbo</h1>
        }
    }

    getAllCustomers = () => {
        ipcRenderer.invoke('getAllCustomers');
    }

    render() { 
        return (  
            <div>
                <h1> This page will contain customer information </h1>
                <button className="btn btn-primary" onClick={this.getAllCustomers}>Get All Customers</button>
                {this.renderCustomers()}
            </div>
        );
    }
}
 
export default Customer;