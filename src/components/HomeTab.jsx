import React, { Component } from 'react';

class Home extends Component {
    state = {  }

    renderLogIn = () => {
        if (this.props.isAccessTokenValid) {
            return <button onClick={this.props.qboSignOut} className="btn btn-warning">Sign Out</button>
        } else {
            return <button onClick={this.props.qboSignIn} className="btn btn-primary">Sign In</button>
        }
    }

    render() { 
        return ( 
            <div>
                <h1> This page will facilitate signing into quickbooks. </h1>
                {this.renderLogIn()}
                <button onClick={this.props.NewSignIn} className="btn btn-primary" >New Sign In</button>
            </div>
         );
    }
}
 
export default Home;