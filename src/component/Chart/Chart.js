import React from 'react';

import { Line } from 'react-chartjs-2';
import './Chart.css';

const chart = (props) => {
    
    let lineChart;

    if(props.plotData && props.plotData.length) {
        lineChart = (
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
                                fontColor: 'white'
                            }
                        }
                    }
                }} />
            );
    } else {
        lineChart = (
            <div style={{ display: 'flex', justifyContent: 'center', color: 'red', fontSize: '2rem'}}>
                <span>'OOPS! No Data to Plot Chart'</span>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="chart" style={{ backgroundColor: props.color }}>
                {lineChart}
            </div>
        </div>
    )
};

export default chart;
