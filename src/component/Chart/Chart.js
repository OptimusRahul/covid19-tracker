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
            }} />
    );

    return (
        <div className="Chartt">
            {lineChart}
        </div>
    )
};

export default chart;
