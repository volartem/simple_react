import React from "react";
import {Router, Route, IndexRoute, browserHistory} from 'react-router-3'
import List from "./List";
import BaseLayout from "./Base";
import IndexComponent from './Main';

const App = () => (
    <Router history={browserHistory}>
        <Route path="/" component={BaseLayout}>
            <IndexRoute component={IndexComponent} />
            <Route path="/courses" component={() => (<List endpoint={"api/v1/courses/"} name={"courses"}/>)}/>
            <Route path="/students" component={() =>(<List endpoint={"api/v1/students/"} name={"students"}/>)}/>
        </Route>
    </Router>
);

export default App;
