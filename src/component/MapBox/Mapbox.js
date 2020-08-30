import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

import './Mapbox.css';

class Mapbox extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            features: [],
            data: null
        }
    }

    componentDidMount() {
        this.setLatLngHandler();
    }

    setLatLngHandler = () => {
        let featuresCoordinates = [];
        this.props.data.map(item => {
            
            let currentCountryCoordinates = [];
            const { latitude, longitude } = item;
            currentCountryCoordinates.push(latitude);
            currentCountryCoordinates.push(longitude);

            return featuresCoordinates.push(currentCountryCoordinates); 
        });
        
        this.setState({ features: featuresCoordinates, data: this.props.data });
    }

    mapBoxHandler = () => {
        if(this.state.features.length > 0) {
            mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ja2VyYWh1bCIsImEiOiJjazQ3OWViOWYwY2puM21xbGs4c2t6NDN1In0.uDPl4qKaa-Cp9FO9fxJlHQ';
            let mapType = this.props.dark ? 'mapbox://styles/rockerahul/ckcss7gaq24ev1ikigj97e1nc' : 'mapbox://styles/rockerahul/ckcxqqv5x14le1io2rk3an2rj';
            const map = new mapboxgl.Map({
                container: this.mapContainer,
                style: mapType,
                center: [this.props.lng, this.props.lat],
                zoom: this.props.zoom
            });

            const nav = new mapboxgl.NavigationControl({
                showCompass: false
            });
                
            map.addControl(nav);

            let size = 100;

            let pulsingDot = {
                width: size,
                height: size,
                data: new Uint8Array(size * size * 4),

                // get rendering context for the map canvas when layer is added to the map
                onAdd: function() {
                    let canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    this.context = canvas.getContext('2d');
                },
                
                // called once before every frame where the icon will be used
                render: function() {
                        let duration = 1000;
                        let t = (performance.now() % duration) / duration;

                        let radius = (size / 2) * 0.3;
                        //let outerRadius = (size / 2) * 0.7 * t + radius;
                        let context = this.context;

                        // draw inner circle
                        context.beginPath();
                        context.arc(
                            this.width / 2,
                            this.height / 2,
                            radius,
                            0,
                            Math.PI * 2
                        );
                        context.fillStyle = 'rgba(255, 100, 100, 1)';
                        context.strokeStyle = 'white';
                        context.lineWidth = 2 + 4 * (1 - t);
                        context.fill();
                        context.stroke();

                        // update this image's data with data from the canvas
                        this.data = context.getImageData(
                            0,
                            0,
                            this.width,
                            this.height
                        ).data;

                        // continuously repaint the map, resulting in the smooth animation of the dot
                        //map.triggerRepaint();

                        // return `true` to let the map know that the image was updated
                        return true;
                    }
            };
            
            if(this.props.countrySpecific === true) {
                map.flyTo({
                    center: [ this.props.lng, this.props.lat ], 
                    essential: true,
                });
            } else {
                map.on('load', () => {
                    map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 });
                    let arr = []
                    this.state.data.forEach(data => {
                        
                        let featuresObj = {
                            'type': 'Feature',
                            'properties': {
                                'description':
                                    '<strong>Truckeroo</strong><p>Truckeroo brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>'
                                },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [data.longitude, data.latitude]
                            }
                        }

                        arr.push(featuresObj);
                    });

                    map.addSource('points', {
                        'type': 'geojson',
                        'data': {
                        'type': 'FeatureCollection',
                        'features': arr
                        }
                    });

                    map.addLayer({
                        'id': 'points',
                        'type': 'symbol',
                        'source': 'points',
                        'layout': {
                        'icon-image': 'pulsing-dot'
                        }
                    });
                });
            }
        }
    }

    render() {
       this.mapBoxHandler();
        return (
            <div>
                <div ref={el => this.mapContainer = el} className="mapContainer" />
            </div>
        );
    }
}

export default Mapbox;