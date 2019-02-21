import React, {Component} from 'react';
import EditItem from '../ListItem';
import key from "weak-key";
import Pagination from "react-js-pagination";
import PropTypes from "prop-types";
import {Button, Modal} from "react-bootstrap";
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

            deleteModal: false,
            itemDeleted: {},

            totalItems: 0,
            itemsCountPerPage: process.env.DEFAULT_PAGINATE_ITEMS_COUNT_ON_PAGE,
            pageRangeDisplayed: 5,
            activePage: 1
        };
        this.itemElement = React.createRef();
    }

    ApiInstance = new Api();


    handleChangeCountPerPage(event) {
        let that = this;
        let countItemsPerPage = event.target.value;
        this.calculateAndSetActivePageAndItemsOnPage(countItemsPerPage).then(
            function () {
                let url = that.prepareUrl(that.state.activePage);
                that.ApiInstance.getRequest(url, that);
            }, function (error) {
                console.error(error);
            });
    }

    prepareUrl(pageNumber, action, item) {
        let offset = this.prepareOffset(pageNumber, action);
        return `${this.props.endpoint}${item ? item.id + "/" : ""}?limit=${this.state.itemsCountPerPage}&offset=${offset}`;
    }

    prepareOffset(pageNumber, action) {
        if (action === "Add") {
            let divisionCurrent = Math.ceil((this.state.totalItems) / this.state.itemsCountPerPage);
            let divisionAfter = Math.ceil((this.state.totalItems + 1) / this.state.itemsCountPerPage);
            if (divisionAfter > divisionCurrent) {
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
        this.setState({
            itemsCountPerPage: itemsCountPerPage,
            totalItems: totalItems,
            activePage: activePage,
            pageRangeDisplayed: pageRangeDisplayed
        })
    }

    calculateAndSetActivePageAndItemsOnPage(itemsOnPage) {
        let that = this;
        return new Promise(function (resolve, reject) {
            try {
                let activePage = that.state.activePage;
                let lastPage = Math.ceil((that.state.totalItems) / itemsOnPage);
                if (that.state.activePage > lastPage || that.state.activePage < lastPage) { // on the last page jump
                    activePage = lastPage;
                }
                that.setState({activePage: activePage, itemsCountPerPage: itemsOnPage});
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }


    addItem() {
        this.itemElement.current.changeItem({}, "Add");
    }

    editItem(item) {
        this.itemElement.current.changeItem(item, "Edit");
    }

    deleteItem(item) {
        this.setState({itemDeleted: item});
        this.handleShowModalDelete();
    }

    confirmDelete() {
        let url = this.prepareUrl(this.state.activePage, "Delete", this.state.itemDeleted);
        this.ApiInstance.deleteRequest(url, this, this.state.itemDeleted);
        this.handleHideModalDelete();
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

    handleHideModalDelete() {
        this.setState({deleteModal: false});
    }

    handleShowModalDelete() {
        this.setState({deleteModal: true});
    }

    render() {
        if (this.state.items.length) {
            return (
                <div className="row">
                    <div className={"col-md-12 col-xs-12"}>
                        <div className={"row"}>
                            <div className={"col-md-10 col-xs-10"}>
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemsCountPerPage}
                                    totalItemsCount={this.state.totalItems}
                                    pageRangeDisplayed={this.state.pageRangeDisplayed}
                                    onChange={this.handlePageChange.bind(this)}/>
                            </div>
                            <div className={"col-md-2 col-xs-2"}>
                                <div className="form-group">
                                    <label className="col-sm-2 control-label">Items:</label>
                                    <select className={"form-control"} value={this.state.itemsCountPerPage}
                                            onChange={this.handleChangeCountPerPage.bind(this)}>
                                        <option value={2}>2</option>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                        <option value={25}>25</option>
                                        <option value={30}>30</option>
                                    </select>
                                </div>

                            </div>
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
                    <Modal show={this.state.deleteModal} onHide={this.handleHideModalDelete.bind(this)}
                           dialogClassName="custom-modal">
                        <Modal.Header>
                            <div> Deleting {this.state.itemDeleted.name} </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div> Are you sure ?</div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleHideModalDelete.bind(this)}>Close</Button>
                            <Button bsStyle="danger" onClick={this.confirmDelete.bind(this)}>{"Confirm"}</Button>
                        </Modal.Footer>
                    </Modal>

                </div>);
        }
        return <div> Sorry, but {this.props.name} are absent...</div>;
    }
}


export default List
