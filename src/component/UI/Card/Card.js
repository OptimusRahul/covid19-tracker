import React from 'react';
import CountUp from 'react-countup';

import './Card.css';

const card = props => {
    return (
        <div className="card" style={{ height: props.height, background: props.bg}}>
            <div className="card__heading" style={{ color: props.heading }}>Total {props.title}</div>
            <div className="card__content" style={{ color: props.color }}>
                <CountUp start={0} end={props.count} duration={2.75} separator="," />
            </div>
        </div>
    );
}

export default card;