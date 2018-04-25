import react, {Component} from 'react'; 
import reactDOM from 'react-dom'; 

import Todo from "./todo/Todo"; 


let enonicReact = react.createElement("div", null, "Enonic loves React!");
let todoReact = react.createElement(Todo, null, []);  

reactDOM.render(enonicReact, document.getElementById("enonicReact"));
reactDOM.render(todoReact, document.getElementById("todoReact"));
