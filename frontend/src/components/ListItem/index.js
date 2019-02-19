import React, {Component} from 'react'
import {Button, Modal, Alert} from "react-bootstrap";
import Api from "../DataApi";

import Student from "../Students";
import Course from "../Courses";


class EditItem extends Component {

    constructor(props) {
        super(props);
        this.handleErrorsDismiss = this.handleErrorsDismiss.bind(this);
        this.handleErrorsShow = this.handleErrorsShow.bind(this);

        this.state = {
            show: false,
            item: undefined,
            action: props.action,
            errorsShow: false,
            errorsList: [],
            courses: this.props.courses
        };
    }

    handleErrorsDismiss() {
        this.setState({errorsShow: false});
    }

    handleErrorsShow() {
        this.setState({errorsShow: true});
    }

    formFieldsError(errors) {
        this.setState({errorsList: errors});
        this.setState({errorsShow: true});
    }

    changeItem(item, action) {
        this.setState({item: item, show: true, action: action});
    }

    handleHide() {
        this.setState({show: false});
    }

    handleShow(item) {
        console.log(item);
        this.setState({show: true});
    }

    handleChange(key, event) {
        let item = this.state.item;
        item[key] = key !== "courses" ? event.target.value : [parseInt(event.target.value)];
        this.setState({item: item});
    }

    apiCall() {
        let url = "/api/v1/courses/";
        if (this.props.name === "students") {
            url = "/api/v1/students/";
        }
        if (this.state.action === "Edit") {
            this.props.ApiInstance.putRequest(url + this.state.item.id + "/", this.state.item, this);
        }
        if (this.state.action === "Add") {
            this.props.ApiInstance.postRequest(url, this.state.item, this);
        }
        this.handleHide();
    }

    render() {
        let that = this;
        let errorsList = Object.keys(that.state.errorsList).map(function (keyItem, index) {
            console.log(keyItem);
            return <p key={"errors_list_" + index}><b>{keyItem}</b> : {that.state.errorsList[keyItem]}</p>;
        });

        return this.state.item !== undefined ? (
            <div className="static-modal">
                {this.state.errorsShow ?
                    <Alert bsStyle="danger" onDismiss={this.handleErrorsDismiss}>
                        <h4>Oh not!!! You've got an error!</h4>
                        {errorsList}
                        <p>
                            <Button onClick={this.handleErrorsDismiss}>Hide</Button>
                        </p>
                    </Alert>
                    : null}
                <Modal show={this.state.show} onHide={this.handleHide.bind(this)} dialogClassName="custom-modal">
                    {this.props.name === "students" ?
                        <Student item={this.state.item} show={this.state.show}
                                 courses={this.state.courses}
                                 action={this.state.action}
                                 handleChange={this.handleChange}/> :
                        <Course item={this.state.item} show={this.state.show}
                                action={this.state.action}
                                handleChange={this.handleChange}/>}
                    <Modal.Footer>
                        <Button onClick={this.handleHide.bind(this)}>Close</Button>
                        <Button bsStyle="primary" onClick={this.apiCall.bind(this)}>{this.state.action}</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        ) : null;
    }
}


export default EditItem;
