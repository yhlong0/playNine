import React, { Component } from 'react';


class Answers extends Component {
    render() {
        return (
            <div className="col-5">
                {this.props.selectedNumbers.map((number, i) =>
                    <span key={i} onClick={() => this.props.unselectNumber(number)}>{number}</span>
                )}
            </div>
        );
    }
}

export default Answers;