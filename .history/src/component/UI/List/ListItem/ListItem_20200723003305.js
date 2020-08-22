import React from 'react';

const listItem = props => (
    <div 
        style={{ color: props.color }}
        onClick={() => {props.currentCountry(props.country)}}>
        <span style={{color: props.color}}>{props.totalCases}</span>{' '}<span style={{ color: props.countryCol}}>{props.country}</span>
        <hr style={{ margin: '0em', borderWidth: '1px', borderColor: '#A2A2A2' }} />
    </div>
);

export default listItem;