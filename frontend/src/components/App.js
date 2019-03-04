import React from "react";
import {Route, BrowserRouter, Switch} from 'react-router-dom'
import List from "./List";
import BaseLayout from "./Base";
import IndexComponent from './Main';
import LoginComponent from './Auth/login';
import Api from "./DataApi";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false
        };
    }

    componentDidMount() {
        let localAuth = Api.apiInitLocalToken();
        if (localAuth === "need refresh") {
            Api.apiLoginRequestRefreshToken().then((data) => {
                console.log("App refresh then data = ", data);
                this.setState({isAuthenticated: data.auth})
            });
        } else {
            this.setState({isAuthenticated: localAuth});
        }
    }

    updateAuthState(auth) {
        console.log("Update App auth state ", auth);
        this.setState({isAuthenticated: auth});
    }

    render() {
        return (
            <BrowserRouter>
                <BaseLayout isAuthenticated={this.state.isAuthenticated}
                            updateAuthState={this.updateAuthState.bind(this)}>
                    <Switch>
                        <Route exact path="/" component={IndexComponent}/>
                        <Route path="/courses"
                               component={() => (<List endpoint={"api/v1/courses/"} name={"courses"}
                                                       isAuthenticated={this.state.isAuthenticated}/>)}/>
                        <Route path="/students"
                               component={() => (<List endpoint={"api/v1/students/"} name={"students"}
                                                       isAuthenticated={this.state.isAuthenticated}/>)}/>
                        <Route path="/login"
                               component={() => <LoginComponent updateAuthState={this.updateAuthState.bind(this)}/>}/>
                    </Switch>
                </BaseLayout>
            </BrowserRouter>
        )
    }
}

export default App;
