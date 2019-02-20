import React, {Component} from 'react';
import EditItem from '../ListItem';
import key from "weak-key";
import Pagination from "react-js-pagination";
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
            items: [],
            related: [],

            totalItems: 0,
            itemsCountPerPage: process.env.DEFAULT_PAGINATE_ITEMS_COUNT_ON_PAGE,
            pageRangeDisplayed: 5,
            activePage: 1
        };
        this.itemElement = React.createRef();
    }

    ApiInstance = new Api();

    prepareUrl(pageNumber, action, item) {
        let offset = this.prepareOffset(pageNumber, action);
        let url = `${this.props.endpoint}${item ? item.id + "/":""}?limit=${this.state.itemsCountPerPage}&offset=${offset}`;
        return url;
    }

    prepareOffset(pageNumber, action) {
        if (action === "Add") {
            let divisionCurrent = Math.ceil((this.state.totalItems) / this.state.itemsCountPerPage);
            let divisionAfter = Math.ceil((this.state.totalItems + 1) / this.state.itemsCountPerPage);
            if (divisionAfter  > divisionCurrent) {
                pageNumber = divisionAfter;
            } else {
                pageNumber = divisionCurrent;
            }
        }
        if (action === "Delete") {
            if (this.state.items.length - 1 <= 0) {
                pageNumber--;
            }
        }
        this.setState({activePage: pageNumber});
        let result = this.state.itemsCountPerPage * pageNumber - this.state.itemsCountPerPage;
        return result;
    }

    handlePageChange(pageNumber) {
        let url = this.prepareUrl(pageNumber);
        this.ApiInstance.getRequest(url, this);
        this.synchronizePaginateState(this.state.totalItems, pageNumber, this.state.itemsCountPerPage, this.state.pageRangeDisplayed);
    }

    synchronizePaginateState(totalItems, activePage, itemsCountPerPage, pageRangeDisplayed) {
        let divisionPages = Math.ceil(totalItems / itemsCountPerPage);
        if (divisionPages < pageRangeDisplayed) {
            pageRangeDisplayed = divisionPages;
        }
        this.setState({
            itemsCountPerPage: itemsCountPerPage,
            totalItems: totalItems,
            activePage: activePage,
            pageRangeDisplayed: pageRangeDisplayed
        })
    }


    addItem() {
        this.itemElement.current.changeItem({}, "Add");
    }

    editItem(item) {
        this.itemElement.current.changeItem(item, "Edit");
    }

    deleteItem(item) {
        let url = this.prepareUrl(this.state.activePage, "Delete", item);
        this.ApiInstance.deleteRequest(url, this, item);
    }

    handleToUpdate(data, action, item) {
        if (action === "Add") {
            this.setState({items: data.result});
            this.setState({totalItems: data.total});
        }
        if (action === "Edit") {
            this.setState({item: item});
        }
    }

    getRequestHandler(data) {
        this.setState({items: data.result, totalItems: data.total, related: data.related});
    }

    componentDidMount() {
        let url = this.prepareUrl(this.state.activePage);
        this.ApiInstance.getRequest(url, this);
    }

    render() {
        if (this.state.items.length) {
            return (
                <div className="row">
                    <div className={"col-md-12 col-xs-12"}>
                        <div className={"text-center"}>
                            <Pagination
                                activePage={this.state.activePage}
                                itemsCountPerPage={this.state.itemsCountPerPage}
                                totalItemsCount={this.state.totalItems}
                                pageRangeDisplayed={this.state.pageRangeDisplayed}
                                onChange={this.handlePageChange.bind(this)}/>
                        </div>
                        {this.props.name === 'courses' ?
                            <EditItem ApiInstance={this.ApiInstance} name={this.props.name} item={this.state.item}
                                      ref={this.itemElement}
                                      action={"Edit"}
                                      activePage={this.state.activePage}
                                      prepareUrl={this.prepareUrl.bind(this)}
                                      handleToUpdate={this.handleToUpdate.bind(this)}/> :
                            <EditItem ApiInstance={this.ApiInstance} name={this.props.name} item={this.state.item}
                                      ref={this.itemElement}
                                      courses={this.state.related} action={"Edit"}
                                      activePage={this.state.activePage}
                                      prepareUrl={this.prepareUrl.bind(this)}
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
                                {this.state.items.length ? Object.entries(this.state.items[0]).map(el =>
                                    <td key={key(el)}>{el[0]}</td>) : null}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.items && this.state.items.length ? this.state.items.map(el => (
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
