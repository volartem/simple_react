import React, {Component} from 'react'
import {Button, Modal, Alert} from "react-bootstrap";
import Student from "../Students";
import Course from "../Courses";
import Api from "../DataApi";

class EditItem extends Component {

    constructor(props) {
        super(props);
        this.handleErrorsDismiss = this.handleErrorsDismiss.bind(this);
        this.handleErrorsShow = this.handleErrorsShow.bind(this);

        this.handleSuccessDismiss = this.handleSuccessDismiss.bind(this);
        this.handleSuccessShow = this.handleSuccessShow.bind(this);

        this.state = {
            show: false,
            item: undefined,
            action: props.action,
            errorsShow: false,
            successShow: false,
            errorsList: [],
            courses: this.props.courses
        };
    }

    handleErrorsDismiss() {
        this.setState({errorsShow: false});
    }

    handleSuccessDismiss() {
        this.setState({successShow: false});
    }

    handleSuccessShow() {
        this.setState({successShow: true});
    }


    handleErrorsShow() {
        this.setState({errorsShow: true});
    }

    formFieldsError(errors) {
        this.setState({errorsList: errors});
        this.handleErrorsShow();
    }

    changeItem(item, action) {
        this.handleSuccessDismiss();
        this.handleErrorsDismiss();
        this.setState({item: item, show: true, action: action});
    }

    handleHide() {
        this.setState({show: false});
    }

    handleChange(key, event) {
        let item = this.state.item;
        item[key] = key !== "courses" ? event.target.value :
            [].filter.call(event.target.selectedOptions, o => o.selected).map(o => o.value);
        this.setState({item: item});
    }

    apiCall() {
        let url = "/api/v1/courses/";
        if (this.props.name === "students") {
            url = "/api/v1/students/";
        }
        if (this.state.action === "Edit") {
            Api.putRequest(url + this.state.item.id + "/", this.state.item, this);
        }
        if (this.state.action === "Add") {
            url = this.props.prepareUrl(this.props.activePage, "Add");
            Api.postRequest(url, this.state.item, this);
        }
        this.handleHide();
    }

    render() {
        let that = this;
        let errorsList = Object.keys(that.state.errorsList).map(function (keyItem, index) {
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
                {this.state.successShow ?
                    <Alert bsStyle="success" onDismiss={this.handleSuccessDismiss}>
                        <h4>Congrats!!!</h4>
                        <p>
                            {this.state.action}ing complete!!!
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
