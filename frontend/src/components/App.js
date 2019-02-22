import React from "react";
import {Router, Route, BrowserRouter, Switch} from 'react-router-dom'
import List from "./List";
import BaseLayout from "./Base";
import IndexComponent from './Main';

const App = () => (
    <BrowserRouter>
        <BaseLayout>
            <Switch>
                <Route exact path="/" component={IndexComponent}/>
                <Route path="/courses" component={() => (<List endpoint={"api/v1/courses/"} name={"courses"}/>)}/>
                <Route path="/students" component={() => (<List endpoint={"api/v1/students/"} name={"students"}/>)}/>
            </Switch>
        </BaseLayout>
    </BrowserRouter>
);

export default App;
