import React from "react";
import PropTypes from "prop-types";
import key from "weak-key";


const Student = ({data}) =>
    !data.length ? null : (
        <div className={"col-md-12 col-xs-12"}>
            <h2>
                Current students:
            </h2>
            <table className={"table table-bordered"}>
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

Student.propTypes = {
    data: PropTypes.array.isRequired
};

export default Student;