import React from 'react'
import {Link} from "react-router-dom";
import {Navbar, Nav, NavItem} from 'react-bootstrap';

const BaseLayout = props => (
    <div>
        <Navbar>
            <Nav>
                <NavItem componentClass={Link} href={"/"} to={"/"}>Main</NavItem>
                <NavItem componentClass={Link} href="/courses" to="/courses"
                         active={location.pathname === '/courses'}>Courses</NavItem>
                <NavItem componentClass={Link} href="/students" to="/students"
                         active={location.pathname === '/students'}>Students</NavItem>
            </Nav>
        </Navbar>
        <div className={"container"}>
            <main>{props.children}</main>
        </div>
        <footer className="page-footer">
            <div className="footer-copyright text-center py-3">
                Created by <a target={"_blank"} href={"https://github.com/volartem"}>volartem</a>
            </div>
        </footer>
    </div>
);


export default BaseLayout;
