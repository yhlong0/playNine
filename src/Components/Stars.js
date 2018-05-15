import React, { } from 'react';

const Stars = (props) => {
    //const numberOfStars = 1 + Math.floor(Math.random() * 9);

    let stars = [];
    for (let i = 0; i < props.numberOfStars; i++) {
        stars.push(<i key={i} className="fa fa-star"></i>)
    }

    return (
        <div className="col-5">
            {stars}
        </div>
    );
};

export default Stars;