import React from 'react';

import { Form } from 'react-bootstrap'
import './CountryPicker.css'

const countryPicker = props => {
    let list = Object.values(props.Countries);
    list = list.map((res, i) => {
        return <option key={i} value={res["Country"]}>{res["Country"]}</option>
    })     
    
    return (
        <div className="select">
            <Form.Group onChange={(e) => props.countryChangedHandler(e.target.value)}>
                <Form.Control as="select" multiple>
                    <option value="Global">Global</option>                
                    {Object.values(props.Countries).map((res, i) => (
                        <option key={i} value={res["Country"]}>{res['Country']}</option>
                    ))}
                </Form.Control>
            </Form.Group>
        </div>
   );
};

export default countryPicker;