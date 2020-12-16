import "./styles.css"
import React, { Component } from 'react';
import Home from "./HomeTab"
import Customer from "./CustomerTab"
import Vendor from "./VendorTab"
import Dashboard from "./DashboardTab"

class Content extends Component {
    state = {  }

    renderContent() {
        if (this.props.tab === "home") {
            return <Home isAccessTokenValid={this.props.isAccessTokenValid} qboSignIn={this.props.qboSignIn} qboSignOut={this.props.qboSignOut} />
        } else if (this.props.tab === "customer") {
            return <Customer isAccessTokenValid={this.props.isAccessTokenValid} />
        } else if (this.props.tab === "vendor") {
            return <Vendor isAccessTokenValid={this.props.isAccessTokenValid} />
        } else if (this.props.tab === "dashboard") {
            return <Dashboard isAccessTokenValid={this.props.isAccessTokenValid} />
        }
    }

    // Condioinally render somethng here dependeing on the props passed
    render() { 
        return ( 
        <div className="content">
            {this.renderContent()}
        </div>
         );
    }
}
 
export default Content;