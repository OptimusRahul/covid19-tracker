import React from 'react';
import { Card } from 'react-bootstrap';
import CountUp from 'react-countup'
import './Card.css';

let color = ["indigo", "green", "red"];

const card = props => {
    let index = `${color[props.index]}`;
    let heading = props.heading.substring(0,1).toUpperCase() + props.heading.substring(1).toLowerCase();
    return( 
        <Card className="Card">
            <Card.Body>
                <Card.Text>{heading}</Card.Text>   
                <Card.Text>Total: {props.total !== 0 ? <CountUp start={0} end={props.total} duration={2.75} separator="," /> : 0 } </Card.Text>
                <Card.Title>New: {props.new !== 0 ? <CountUp start={0} end={props.new} duration={2.75} separator="," /> : 0} </Card.Title>
                <Card.Text>Date: {props.date}</Card.Text>
            </Card.Body>
            <Card.Footer style={{backgroundColor: `${index}`}}></Card.Footer>
        </Card>
    );
};

export default card;