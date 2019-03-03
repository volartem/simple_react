import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {Redirect} from "react-router-dom"
import Api from "../DataApi";

export default class LoginComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            toIndex: false
        };
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();
        let that = this;
        if (this.validateForm()) {
            Api.apiLoginRequest(this.state.username, this.state.password).then(data => {
                that.setState({toIndex: true}, () => {
                    that.props.updateAuthState(true);
                });

            }, error => {
                // #TODO: show alert div
                console.log("login then error = \n", error);
            });
        } else {
            // #TODO: make
        }
    };

    render() {
        if (this.state.toIndex === true) {
            return <Redirect to='/'/>
        }
        return (
            <div className={"container"}>
                <div className="row">
                    <div className="col-md-12 col-xs-12">
                        <form onSubmit={this.handleSubmit.bind(this)}>
                            <FormGroup controlId="username" bsSize="small">
                                <ControlLabel>Username</ControlLabel>
                                <FormControl
                                    autoFocus
                                    type="text"
                                    value={this.state.username}
                                    onChange={this.handleChange.bind(this)}
                                />
                            </FormGroup>
                            <FormGroup controlId="password" bsSize="small">
                                <ControlLabel>Password</ControlLabel>
                                <FormControl
                                    value={this.state.password}
                                    onChange={this.handleChange.bind(this)}
                                    type="password"
                                />
                            </FormGroup>
                            <Button
                                block
                                bsSize="large"
                                disabled={!this.validateForm()}
                                type="submit">
                                Login
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
