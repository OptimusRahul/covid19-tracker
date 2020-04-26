import React from 'react';

import Card from './Card/Card';
import './Cards.css';

const cards = props => {
    let status = props.stats.map((items, i)=>{
        return items.map(item =>{
            if(item["Total"] >= 0|| item["New"] >= 0)
                return <Card 
                        heading={items[0]}
                        total={item["Total"]}
                        new={item["New"]}
                        date={props.date} 
                        index={i}
                        key={i} />
        });
    });
    
    return(
        <div className="cards">
            {status}
        </div>
    );
};

export default cards;