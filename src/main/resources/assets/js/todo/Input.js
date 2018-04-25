import React, { Component } from "react";


class Input extends Component{
    componentWillMount(){
        this.setState({value : ""}); 
    }
    changeInputValue(event){
        this.setState({value : event.target.value}); 
        console.log(this.state.value); 
    }
    render(){
        return <div>
            <input type="text" onChange={this.changeInputValue.bind(this)}></input>
            <button onClick={() => {
                this.props.addItem(this.state.value)
            }}>add</button>
        </div>
    }
}


export default Input; 