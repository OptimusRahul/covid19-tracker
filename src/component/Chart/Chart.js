import React from 'react';

import { Line } from 'react-chartjs-2';
import './Chart.css';

const chart = (props) => {
    
    const lineChart = (
        <Line 
            data = {{
                labels: props.plotData.map((res) => res.date),
                datasets: [{
                    data: props.plotData.map((res)=> res.confirmed),
                    label: 'Infected',
                    borderColor: '#3333ff',
                    fill: true
                }, {
                    data: props.plotData.map((res)=> res.deaths),
                    label: 'Deaths',
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    fill: true
                }, {
                    data: props.plotData.map((res) => res.recovered),
                    label: 'Recovered',
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    fill: true
                }],
                options: {
                    legend:{
                        labels:{
                            display: true,
                            fontColor: 'blue'
                        }
                    }
                }
            }} />
    );

    return (
        <div className="container">
            <div className="heading">
                <h2 style={{color: 'white'}}>Current {props.currentCountry} Status</h2>
            </div>
            <div className="Chartt">
                {lineChart}
            </div>
        </div>
    )
};

export default chart;
