import React, { Component } from 'react';

class Customer extends Component {
    state = {  }
    renderCustomers = () => {
        if (this.props.isAccessTokenValid) {
            return <h1>User is signed into qbo</h1>
        } else {
            return <h1>User is not signed into qbo</h1>
        }
    }

    render() { 
        return (  
            <div>
                <h1> This page will contain customer information </h1>
                {this.renderCustomers()}
            </div>
        );
    }
}
 
export default Customer;