import React, { Component } from 'react';

import { summary, globalStatus, totalStats } from '../../store/api/getTotalStatus';
import Header from '../../component/Header/Header';
import Card from '../../component/UI/Cards/Cards';
import CountryPicker from '../../component/UI/CountryPicker/CountryPicker';
import Spinner from '../../component/UI/Spinner/Spinner'
import Chart from '../../component/Chart/Chart'
import './Dashboard.css';

class Dashboard extends Component {

    state = {
        summary: {
            "Global": {
                "infected": {
                    "Total": 0,
                    "New": 0
                },
                "recovered": {
                    "Total": 0,
                    "New": 0
                },
                "deaths": {
                    "Total": 0,
                    "New": 0
                }
            },
            "Countries": null,
            "Date": null
        },
        Country: {
            "infected": {
                "Total": 0,
                "New": 0
            },
            "recovered": {
                "Total": 0,
                "New": 0
            },
            "deaths": {
                "Total": 0,
                "New": 0
            },
            "Date": null   
        },
        currentCountry: null,
        Chart: null,
        singleEntity: false,
        status: false
    }

    async componentDidMount(){
        let status = await summary();
        let stat = await globalStatus();
        this.setState({Chart: stat})
        this.setState({
            summary: {
                Global:{
                    infected: {
                        Total: status.data.Global.TotalConfirmed, 
                        New: status.data.Global.NewConfirmed
                    },
                    recovered: {
                        Total: status.data.Global.TotalRecovered,
                        New: status.data.Global.NewRecovered
                    },
                    death: {
                        Total: status.data.Global.TotalDeaths,
                        New: status.data.Global.NewDeaths
                    }
                },
                Countries: status.data.Countries,
                Date: status.data.Date.substring(0,10)  
            },
            currentCountry: 'Global',
            status: true,
        });
    }

    countryChangedHandler = async(country) => {
        let singleEntity;
        if(country === 'Global'){
            this.setState({
                singleEntity: false,
                Chart: await globalStatus()
            });
        }
        else {
            let countryChart = await totalStats(country);
            this.setState({ Chart: countryChart });
            Object.values(this.state.summary.Countries).map(res => {
                if(country === res["Country"]){
                    singleEntity = res;
                    return singleEntity;
                }
                return singleEntity;
            })
            this.setState({
                Country:{
                    infected: {
                        Total: singleEntity.TotalConfirmed, 
                        New: singleEntity.NewConfirmed
                    },
                    recovered: {
                        Total: singleEntity.TotalRecovered,
                        New: singleEntity.NewRecovered
                    },
                    death: {
                        Total: singleEntity.TotalDeaths,
                        New: singleEntity.NewDeaths
                    },
                    Date: singleEntity.Date.substring(0,10)
                },
                singleEntity: true,
                currentCountry: country
            });
        }
    }
 
    render(){
        let stats;
        let chart;
        if(this.state.singleEntity){
            stats = Object.entries(this.state.Country);
            chart = this.state.Chart
        } else if(!this.state.status || this.state.summary.Global.infected.Total === 0){
            stats = <Spinner />
        } 
        else {
            stats = Object.entries(this.state.summary.Global);
            chart = this.state.Chart
            /*stats.map((items)=>{
                items.map((item, i) => {
                    console.log(items[0], item["Total"], item["New"])
                })
            })*/
        }
        return (
            <div className="Dashboard">
                <div className="Dash-img">
                    <header>
                        <Header />
                    </header>
                    <div className="CurrentCountry">
                        <h2 style={{color: 'white'}}>{this.state.currentCountry} Status </h2>
                    </div>
                    <main>
                        {this.state.summary.singleEntity || this.state.summary.Global.infected.Total !== 0 ? <Card stats={stats} date={this.state.summary.Date} /> : <Spinner />}
                    </main>
                    <section className="CountryPicker">
                        <CountryPicker 
                            Countries={this.state.summary.Countries === null ? 'Global' : this.state.summary.Countries} 
                            countryChangedHandler={this.countryChangedHandler}/>
                    </section>
                </div>
                <section className="Chart">
                    {this.state.status ? <Chart plotData={chart} currentCountry={this.state.currentCountry} /> : <Spinner />}
                </section>
            </div>
        );
    }
}

export default Dashboard;