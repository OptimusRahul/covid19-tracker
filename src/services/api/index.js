import axios from 'axios';

export const summary = async() => {
    return await axios.get('https://api.covid19api.com/summary')
        .then(res=>{
            return res;
        })
        .catch(error => {
            return error;
    });
};

export const totalStats = async(countryName) => {
    return await axios.get(`https://api.covid19api.com/total/country/${countryName}`)
        .then(res=>{
            return res.data.map(({ Confirmed, Deaths, Recovered, Date }) => ({
                confirmed: Confirmed,
                deaths: Deaths,
                recovered: Recovered,
                date: Date.substring(0, 10)
            })
        )
    });
};

export const globalStatus = async() => {
    return await axios.get('https://covid19.mathdro.id/api/daily')
        .then(res=>{
            return res.data.map(({ confirmed, deaths, reportDate: date }) => ({
                    confirmed: confirmed.total,
                    deaths: deaths.total,
                    date   
                }));
        })
        .catch(error=>{
            return error;
        })
}

export const getCountriesName = async() => {
    return await axios.get('https://api.covid19api.com/countries')
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}

export const getCountriesData = async() => {
    return await axios.get('https://www.trackcorona.live/api/countries')
        .then(res => {
            return res;
        })
        .catch(err => {
            return err;
        })
}