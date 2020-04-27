import React from 'react';

import { NativeSelect, FormControl } from '@material-ui/core';
import './CountryPicker.css';

const countryPicker = props => {    
    return (
        <div className="select">
            <FormControl>
                <NativeSelect defaultValue="" onChange={(e) => props.countryChangedHandler(e.target.value)}>
                    <option value="Global">Global</option>
                    {Object.values(props.Countries).map((res, i) => (
                        <option key={i} value={res["Country"]}>{res['Country']}</option>
                    ))}
                </NativeSelect>
            </FormControl>
        </div>
   );
};

export default countryPicker;