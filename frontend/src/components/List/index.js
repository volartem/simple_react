import React, {Component} from 'react';
import EditItem from '../ListItem';
import key from "weak-key";

import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import Api from "../DataApi";


class List extends Component {

    static propTypes = {
        endpoint: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            item: {},
            items: []
        };
        this.itemElement = React.createRef();
    }

    ApiInstance = new Api();

    addItem() {
        this.itemElement.current.changeItem({}, "Add");
    }

    editItem(item) {
        this.itemElement.current.changeItem(item, "Edit");
    }

    handleShow(item) {
        this.setState({show: true});
    }

    deleteItem(item) {
        this.setState({item: item});
        this.ApiInstance.apiRequest("api/v1/" + this.props.name + "/" + item.id + "/", "DELETE", item)
        .then(response => {
            if (response.status === 204) {
                let items = this.state.items;
                items.result = items.result.filter(i => i !== item);
                this.setState({items: items});
            }
        });
    }

    handleToUpdate(item, action) {
        if (action === "Add") {
            let items = this.state.items;
            items['result'].push(item);
            this.setState({items: items});
        }
        if (action === "Edit") {
            this.setState({item: item});
        }
    }

    componentDidMount() {
        this.ApiInstance.apiRequest(this.props.endpoint).then(response => {
            if (response.status !== 200) {
                return this.setState({placeholder: "Something went wrong"});
            }
            return response.json();
        })
        .then(data => this.setState({items: data}));
    }

    render() {
        if (this.state.items["result"]) {
            return (
                <div className="row">
                    <div className={"col-md-12 col-xs-12"}>

                        {this.props.name === 'courses' ?
                            <EditItem ApiInstance={this.ApiInstance} name={this.props.name} item={this.state.item} ref={this.itemElement}
                                      action={"Edit"}
                                      handleToUpdate={this.handleToUpdate.bind(this)}/> :
                            <EditItem ApiInstance={this.ApiInstance} name={this.props.name} item={this.state.item} ref={this.itemElement}
                                      courses={this.state.items["related"]} action={"Edit"}
                                      handleToUpdate={this.handleToUpdate.bind(this)}/>
                        }
                        <div className={"row"}>
                            <div className={"col-md-8 col-xs-8"}>
                                <b>
                                    Current {this.props.name}:
                                </b>
                            </div>
                            <div className={"col-md-4 col-xs-4"}>
                                <Button bsSize="small" bsStyle="success" onClick={this.addItem.bind(this)}>
                                    Add {this.props.name}
                                </Button>
                                <p></p>
                            </div>
                        </div>
                        <table className={"table "}>
                            <thead>
                                <tr>
                                    {this.state.items["result"].length ? Object.entries(this.state.items["result"][0]).map(el =>
                                        <td key={key(el)}>{el[0]}</td>) : null}
                                </tr>
                            </thead>
                            <tbody>
                            {this.state.items  && this.state.items["result"].length ? this.state.items["result"].map(el => (
                                <tr key={el.id}>
                                    {Object.entries(el).map(el => <td key={key(el)}>{String(el[1])}</td>)}
                                    <td>
                                        <Button bsStyle="primary" onClick={this.editItem.bind(this, el)}>
                                            Edit / Show
                                        </Button>
                                    </td>
                                    <td>
                                        <Button bsStyle="danger" onClick={this.deleteItem.bind(this, el)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )) : null}
                            </tbody>
                        </table>

                    </div>
                </div>);
        }
        return <div>Loading...</div>;
    }
}


export default List
