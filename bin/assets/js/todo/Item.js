import React, { Component } from "react";

class Item extends Component{
    render(){
        return <div style={styles}>
            <span>{this.props.text}</span>
            <button onClick={() => {
                this.props.deleteItem(this.props.text);
            }}>Delete</button>
        </div>
    }
}

const styles = {
    "backgroundColor":"lightgrey",
    "color":"navy", 
    "padding":"0.25vh",
    "margin":"0.5vh" 
}


export default Item; 