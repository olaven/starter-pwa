import React, { Component } from "react";

class Item extends Component{
    render(){
        return <div>
            <span>{this.props.text}</span>
            <button onClick={() => {
                this.props.deleteItem(this.props.text);
            }}>Delete</button>
        </div>
    }
}

export default Item; 