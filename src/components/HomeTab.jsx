import React, { Component } from 'react';

class Home extends Component {
    state = {  }

    renderLogIn = () => {
        if (this.props.isAccessTokenValid === true) {
            return <button onClick={this.props.qboSignOut}>Sign Out</button>
        } else {
            return <button onClick={this.props.qboSignIn}>Sign In</button>
        }
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