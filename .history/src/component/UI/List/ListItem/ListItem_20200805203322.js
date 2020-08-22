import React from 'react';

const listItem = props => (
    <div 
        style={{ color: props.color }}
        onClick={() => {props.currentCountry(props.country)}}>
        <span style={{color: props.color}}>{props.totalCases}</span>{' '}<span style={{ color: props.countryCol}}>{props.country}</span>
        <img src={`https://www.countryflags.io/${item.country_code}/flat/32.png`} alt="Flag" />{' '}
        <hr style={{ margin: '0em', borderWidth: '1px', borderColor: '#A2A2A2' }} />
    </div>
);

export default listItem;