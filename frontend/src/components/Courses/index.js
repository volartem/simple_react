import React, {Component} from 'react'
import {ControlLabel, FormGroup, FormControl, Modal} from "react-bootstrap";


class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            item: props.item,
            action: props.action
        };
    }

    render() {

        return this.state.item !== undefined ? (
            <div>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Current course
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <FormGroup>
                            <ControlLabel>{"id"}</ControlLabel>
                            <FormControl
                                readOnly
                                name={"id"}
                                type="text"
                                value={this.state.item.id ? this.state.item.id : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"name"}</ControlLabel>
                            <FormControl
                                name={"name"}
                                onChange={this.props.handleChange.bind(this, "name")}
                                type="text"
                                value={this.state.item.name ? this.state.item.name : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"short description"}</ControlLabel>
                            <FormControl
                                type="text"
                                onChange={this.props.handleChange.bind(this, "short_description")}
                                value={this.state.item.short_description ? this.state.item.short_description : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"description"}</ControlLabel>
                            <FormControl
                                type="textarea"
                                onChange={this.props.handleChange.bind(this, "description")}
                                value={this.state.item.description ? this.state.item.description : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"code"}</ControlLabel>
                            <FormControl
                                type="text"
                                onChange={this.props.handleChange.bind(this, "code")}
                                value={this.state.item.code ? this.state.item.code : ""}/>
                        </FormGroup>
                    </div>
                </Modal.Body>
            </div>
        ) : null;
    }
}


export default Course;
