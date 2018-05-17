import React, { } from 'react';

const DoneFrame = (props) => {
    return (
        <div className="text-center">
            <h2>{props.doneStatus}</h2>
            <br />
            <h3 className={props.giftClassColor}><i className="fas fa-gift fa-3x"></i></h3>
            <br />
            <br />
            <hr />
            <button className="btn btn-secondary" 
                    onClick={props.playAgain}>
                Play Again
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-danger"
                onClick={props.playDifficult}>
                Difficult Mode
            </button>
        </div>
    );
};

export default DoneFrame;