import React from 'react';

import ListItem from './ListItem/ListItem';
import './List.css'

const list = props => {
    let totalCaseCount; 
    return ( 
        <div className="List" style={{ height: `calc(100vh - ${props.height}`, background: props.bg }}>
            {props.countrySummary.map((item, i) => {
                if(props.type === 'Confirmed') totalCaseCount = item.confirmed;
                else if(props.type === 'Deaths') totalCaseCount = item.dead;
                else totalCaseCount = item.recovered;
                return (
                    <ListItem
                        scroll={props.scroll}
                        currentCountry={props.currentCountry}
                        key={i}
                        totalCases={totalCaseCount} 
                        country={item.location} 
                        color={props.color}
                        countryCol={props.country}
                        country_code={item.country_code}/>
                )
            })}
        </div>
     );
};

export default list;