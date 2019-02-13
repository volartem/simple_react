import React from "react";
import ReactDOM from "react-dom";
import DataProvider from "./DataProvider";
import Course from "./Course";
import Student from "./Student";

const App = () => (
    <div className={"row"}>
        <DataProvider endpoint="api/v1/courses/"
                      render={data => <Course data={data}/>}/>
        <DataProvider endpoint="api/v1/students/"
                      render={data => <Student data={data}/>}/>
    </div>
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App/>, wrapper) : null;