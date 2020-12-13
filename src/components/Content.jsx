import "./styles.css"
import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron')

class Content extends Component {
    state = {  }

    onAuth() {
        ipcRenderer.invoke('openAuth');
        console.log("is htis getting triggered");
    }

    // Condioinally render somethng here dependeing on the props passed
    render() { 
        return ( 
        <div className="content">
            <h1>Hello, how are you? Fine Thank you. I wish I were a bird.</h1>
            <h2> {this.props.tab} </h2>
            <h2>This is just to show hot reload</h2>
            <button onClick={this.onAuth}> Hey how is it going</button>
        </div>
         );
    }
}
 
export default Content;