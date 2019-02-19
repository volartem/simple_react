import React from 'react'
import {Link} from "react-router-3";


const BaseLayout = ({children, location}) => (
    <div>
        <nav className="navbar navbar-default">
            <div className="container-fluid">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                            data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span className="sr-only">Toggle navigation</span>
                    </button>
                    <a className="navbar-brand" href="/">Main</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                        <li><Link to="/students">Students</Link></li>
                        <li><Link to="/courses">Courses</Link></li>
                    </ul>
                    {/*<form className="navbar-form navbar-left">*/}
                        {/*<div className="form-group">*/}
                            {/*<input type="text" className="form-control" placeholder="Search"/>*/}
                        {/*</div>*/}
                        {/*<button type="submit" className="btn btn-default">Search</button>*/}
                    {/*</form>*/}
                </div>

            </div>
        </nav>
        <div className={"container"}>
            {React.cloneElement(children, {
                key: location.pathname
            })}
        </div>
        <footer className="page-footer">
            <div className="footer-copyright text-center py-3">
                Created by <a target={"_blank"} href={"https://github.com/volartem"}>volartem</a>
            </div>
        </footer>
    </div>
);


export default BaseLayout;
