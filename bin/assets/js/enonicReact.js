const react = require('react'); 
const reactDOM = require('react-dom'); 

let enonicReact = react.createElement("div", null, "Enonic loves React!"); 

reactDOM.render(enonicReact, document.getElementById("enonicReact"));
