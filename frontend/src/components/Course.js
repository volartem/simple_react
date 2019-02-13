import React from "react";
import PropTypes from "prop-types";
import key from "weak-key";

const Course = ({data}) =>
    !data.length ? null : (
        <div className={"col-md-12 col-xs-12"}>
            <h2>
                Current courses:
            </h2>
            <table className={"table"}>
                <thead>
                <tr>
                    {Object.entries(data[0]).map(el => <th key={key(el)}>{el[0]}</th>)}
                </tr>
                </thead>
                <tbody>
                {data.map(el => (
                    <tr key={el.id}>
                        {Object.entries(el).map(el => <td key={key(el)}>{el[1]}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

Course.propTypes = {
    data: PropTypes.array.isRequired
};

export default Course;