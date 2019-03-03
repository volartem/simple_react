import React from 'react'
import {Link} from "react-router-dom";
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import Api from "../DataApi";

class BaseLayout extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLogout = () => {
        Api.apiLogoutRequest();
        this.props.updateAuthState(false);
    };

    render() {
        return (
            <div>
                <Navbar>
                    <Nav>
                        <NavItem componentClass={Link} href={"/"} to={"/"}>Main</NavItem>
                        <NavItem componentClass={Link} href="/courses" to="/courses"
                                 active={location.pathname === '/courses'}>Courses</NavItem>
                        <NavItem componentClass={Link} href="/students" to="/students"
                                 active={location.pathname === '/students'}>Students</NavItem>
                        {this.props.isAuthenticated
                            ? <NavItem onClick={this.handleLogout.bind(this)}>Logout</NavItem>
                            : <NavItem componentClass={Link} href="/login" to="/login"
                                       active={location.pathname === '/login'}>Login</NavItem>
                        }
                    </Nav>
                </Navbar>
                <div className={"container"}>
                    <main>{this.props.children}</main>
                </div>
                <footer className="page-footer">
                    <div className="footer-copyright text-center py-3">
                        Created by <a target={"_blank"} href={"https://github.com/volartem"}>volartem</a>
                    </div>
                </footer>
            </div>
        )
    }
}


export default BaseLayout;
