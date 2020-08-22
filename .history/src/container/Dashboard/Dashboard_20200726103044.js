import React, { Component } from 'react';
import { Row, Col, Switch, Carousel, Tooltip, Spin } from 'antd';
import { GlobalOutlined, LoadingOutlined } from '@ant-design/icons';

import { totalStats, globalStatus, summary, getCountriesData } from '../../services/api/getTotalStatus';
import MapBox from '../../component/MapBox/Mapbox';
import Chart from '../../component/Chart/Chart';
import Card from '../../component/UI/Card/Card';
import List from '../../component/UI/List/List';
import Drawer from '../../component/Drawer/Drawer';

import './Dashboard.css';

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            chart: null,
            lng: 5,
            lat: 34,
            zoom: 1.5,
            heading: 'Coronavirus COVID 19 Global Cases',
            globalSummary: null,
            countries: null,
            map: null,
            countrySpecific: false,
            hasError: false,
            errMessage: null,
            dark: true,
            dotPosition: 'right',
        }
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.chartDataHandler();
        this.covidGlobalHandler();
        this.countryDataHandler();
    }

    errorHandler = () => {
        this.setState({
            hasError: true,
            errMessage: 'Failed To Fetch Data'
        })
    };

    countryDataHandler = async() => {
        const data = await getCountriesData();
        console.log(data);
        if(data !== null || data !== undefined) {
            let countryMap = new Map();
            data.data.data.map(item => {
                return countryMap.set(item.location, item);
            })
            this.chartDataHandler();
            this.setState({ countries: data.data.data, map: countryMap, loading: false });
        } else {
            this.errorHandler();
        }
    }

    covidGlobalHandler = async() => {
        const data = await summary();
        console.log(data);
        if(data !== null || data !== undefined) {
            this.setState({ globalSummary: data.data.Global, countrySpecific: false, countrySummary: data.data.Countries, loading: false })
        } else {
            this.errorHandler();
        }
    }

    chartDataHandler = async(data = null) => {
        let stat;
        if(data === null) {
            stat = await globalStatus();
        } else {
            stat = await totalStats(data);
        }

        if(stat) {
            this.setState({ chart: stat })
        } else {
            this.errorHandler();
        }
    }

    setCurrentCountryData = (data) => {
       let currentCountry = this.state.map.get(data);
       let summary = {
        "TotalConfirmed": currentCountry.confirmed,
        "TotalDeaths": currentCountry.dead,
        "TotalRecovered": currentCountry.recovered
       }
       this.chartDataHandler(data);
       this.setState({ globalSummary: summary, lng: currentCountry.longitude, lat: currentCountry.latitude, countrySpecific: true, loading: false })
    }

    toggleTheme = () => {
        this.setState(prevState => ({
            dark: !prevState.dark
        }))
    }

    cardDataHandler = (totalCaseCount, title, height, fg, bg, color) => (
        <Card
            hasError={this.state.hasError}
            count={totalCaseCount}
            title={title}
            height={height}
            color={fg}
            bg={bg}
            heading={color}/>
    );

    countryListHandler = (data, type, height, fg, bg, color) => (
        <List
            hasError={this.state.hasError}
            scroll={this.scrollDiv}
            countrySpecific={this.state.countrySpecific}
            currentCountry={this.setCurrentCountryData}
            type={type}
            countrySummary={data}
            height={height}
            color={fg}
            bg={bg}
            display='false'
            country={color}/>
    );

    render() {
        let currentRenderingComponent;
        const spinner = <LoadingOutlined style={{ fontSize: 24 }} spin />
        if(this.state.loading) {
            currentRenderingComponent = <Spin indicator={spinner} />;
        } else {
            const { dotPosition } = this.state;
            let data = this.state.globalSummary;
            let totalCaseCount = 0, totalDemiseCount = 0, totalRecoveredCount = 0;
            let totalCases = <Spin indicator={spinner} />, totalDeaths = <Spin indicator={spinner} />, totalRecovered = <Spin indicator={spinner} />;
            let bg = '#403d3d', background='#000', color="#fff";

            if(!this.state.dark) {
                bg = 'rgb(232 232 232)';
                color = '#000'
                background = '#fffff2'
            }

            if(data) {
                totalCaseCount = data.TotalConfirmed;
                totalDemiseCount = data.TotalDeaths;
                totalRecoveredCount = data.TotalRecovered;
                totalCases = this.cardDataHandler(totalCaseCount, 'Confirmed', '8.5rem', 'red', bg, color);
                totalDeaths = this.cardDataHandler(totalDemiseCount, 'Deaths', '5rem', color, bg, color);
                totalRecovered = this.cardDataHandler(totalRecoveredCount, 'Recovered', '5rem', 'green', bg, color);
            }

            let totalCaseList = <Spin indicator={spinner} /> , totalDeathList = <Spin indicator={spinner} />, totalRecoverdList = <Spin indicator={spinner} />;
            let mapBox = <Spin indicator={spinner} />;
            let drawer = <Spin indicator={spinner} />
            let countryData = this.state.countries;
            let fg = this.state.dark ? 'white' : 'purple'
            if(countryData !== null) {
                totalCaseList = this.countryListHandler(countryData, 'Confirmed', '13rem', 'red', bg, color);
                totalDeathList = this.countryListHandler(countryData, 'Deaths', '22.1rem', fg, bg, color);
                totalRecoverdList = this.countryListHandler(countryData, 'Recovered', '22.1rem', 'green', bg, color);
                mapBox = (
                    <MapBox
                        dark={this.state.dark}
                        hasError={this.state.hasError}
                        data={this.state.countries}
                        lng={this.state.lng}
                        lat={this.state.lat}
                        zoom={this.state.zoom} />
                );
                drawer = (
                    <Drawer
                        dark={this.state.dark}
                        bg={bg}
                        color={color}
                        countrySummary={this.state.countries}
                        currentCountry={this.setCurrentCountryData}/>
                );
            }
            let chart = <Spin indicator={spinner} />;
            if(this.state.chart) {
               chart = <Chart plotData={this.state.chart} color={bg} />;
            }

            currentRenderingComponent = (
                <>
                    <div className={this.state.dark ? "dark-mode Desktop" : "light-mode Desktop"}>
                        <Row className="Heading" style={{ background: background, color: color }}>
                            <Col className="Heading__Col" style={{ background: bg, color: color }}>
                                <GlobalOutlined className="icon" onClick={this.covidGlobalHandler} />
                                Coronavirus (Covid-19) Global Report
                                <Switch defaultChecked onChange={this.toggleTheme} />
                            </Col>
                        </Row>
                        <Row className="MainContainer" style={{ background }}>
                            <Col className="Common_Display" span={4}>
                                {totalCases}
                                {totalCaseList}
                            </Col>
                            <Col span={12}>
                                {mapBox}
                            </Col>
                            <Col className="Col_Height" span={8}>
                                <Row>
                                    <Col span={12}>
                                        {totalDeaths}
                                        {totalDeathList}
                                    </Col>
                                    <Col span={12}>
                                        {totalRecovered}
                                        {totalRecoverdList}
                                    </Col>
                                </Row>
                                <Row>
                                    {chart}
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    <div className="MobileView" style={{ display: 'flex', flexFlow: 'column', background }}>
                        <Carousel dotPosition={dotPosition} style={{ color: 'red' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                                {this.cardDataHandler(totalCaseCount, 'Confirmed', '' , 'red', bg, color)}
                            </div>
                            {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                                {this.cardDataHandler(totalCaseCount, 'Confirmed', '5rem', 'red', bg, color)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                                {this.cardDataHandler(totalCaseCount, 'Confirmed', '5rem', 'red', bg, color)}
                            </div> */}
                        </Carousel>
                        <div className="MobileView--nav">
                                <Tooltip title="countries">
                                    {drawer}
                                </Tooltip>
                                <Tooltip title="Global">
                                    <button onClick={this.covidGlobalHandler} style={{ border: 'none', background: 'transparent' }}>
                                        <img src="https://img.icons8.com/dusk/64/000000/globe-earth.png" alt="globe"/>
                                    </button>
                                </Tooltip>
                                <Tooltip title="mode">
                                    <button onClick={this.toggleTheme} style={{ border: 'none', background: 'transparent' }}>
                                        {!this.state.dark ?
                                            <img src="https://img.icons8.com/doodle/48/000000/sun--v1.png" alt="sun" /> :
                                            <img src="https://img.icons8.com/plasticine/48/000000/crescent-moon.png" alt="moon" />
                                        }
                                    </button>
                                </Tooltip>
                        </div>
                    </div>
                </>
            );
        }

        return (
            <div style={{ height: '100vh' }}>
                {currentRenderingComponent}
            </div>
        )
    }
}

export default Dashboard;