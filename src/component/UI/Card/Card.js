import React from 'react';
import CountUp from 'react-countup';

import './Card.css';

const card = props => {
    return (
        <div className="Card" style={{ height: props.height, background: props.bg}}>
            <div className="Card__Heading" style={{ color: props.heading }}>Total {props.title}</div>
            <div className="Card__Content" style={{ color: props.color }}>
                <CountUp start={0} end={props.count} duration={2.75} separator="," />
            </div>
        </div>
    );
}

export default card;