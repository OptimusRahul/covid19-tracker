import axios from '../../axios';

export const getAllCountries = () =>{
    axios.get('/countries')
        .then(res=> {
            const countries = [];
            for(let Country in res.data){
                countries.push({
                    ...res.data[Country],
                    id: Country
                });
            }
            return countries;
        })
        .catch(error => {
            return error;
        });
};