import React, { Component } from "react";

import Input from "./Input"; 
import Item from './Item'; 


class Todo extends Component{
    constructor(){
        super(); 
        this.state = {items : []}; 
    }

    componentDidMount(){
        this.setState({
            items : [
                "hi"
            ]
        })

    }

    addItem(item){
        if(item.length <= 0) return; 
        let updated = this.state.items; 
        updated.push(item); 

        this.setState({items : updated}); 
    }

    deleteItem(item){
        let items = this.state.items; 
        let index = items.indexOf(item); 
        
        items.splice(index, 1); 

        this.setState({items : items}); 
    }

    renderItems(){
        return this.state.items.map(item => {
            return <Item text={item} deleteItem={this.deleteItem.bind(this)} key={Math.random(0, 100)} />;
        });
    }

    render(){
        return <div>
            <Input addItem={this.addItem.bind(this)}/>
            {this.renderItems()}
        </div>
    }
}

export default Todo; 