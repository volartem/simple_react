import React, {Component} from 'react'
import {ControlLabel, Checkbox, FormGroup, FormControl, Modal} from "react-bootstrap";
import key from "weak-key";


class Student extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            item: props.item,
            action: props.action
        };
    }

    render() {
        let that = this;
        let courseList = that.props.courses.map(function (obj, index) {
            return <option key={key(obj)} value={obj.name}>{obj.name}</option>;
        });

        return this.state.item !== undefined ? (
            <div>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Current student
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <FormGroup>
                            <ControlLabel>{"id"}</ControlLabel>
                            <FormControl
                                readOnly
                                type="text"
                                value={this.state.item.id ? this.state.item.id : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"name"}</ControlLabel>
                            <FormControl
                                type="text"
                                required
                                onChange={this.props.handleChange.bind(this, "name")}
                                value={this.state.item.name ? this.state.item.name : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"surname"}</ControlLabel>
                            <FormControl
                                type="text"
                                required
                                onChange={this.props.handleChange.bind(this, "surname")}
                                value={this.state.item.surname ? this.state.item.surname : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"email"}</ControlLabel>
                            <FormControl
                                type="email"
                                required
                                onChange={this.props.handleChange.bind(this, "email")}
                                value={this.state.item.email ? this.state.item.email : ""}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"status"}</ControlLabel>
                            <Checkbox readOnly
                                      checked={this.state.item ? this.state.item.status : false}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>{"Courses"}</ControlLabel>
                            <FormControl name={"courses"} componentClass="select" multiple
                                         value={this.state.item.courses ? this.state.item.courses : []}
                                         onChange={this.props.handleChange.bind(this, "courses")}>
                                {courseList}
                            </FormControl>
                        </FormGroup>
                    </div>
                </Modal.Body>
            </div>
        ) : null;
    }
}


export default Student;
