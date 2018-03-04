import GoogleMapReact from 'google-map-react';
import React, {Component} from 'react';
import {Card, CardBody, CardTitle} from 'reactstrap';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const GOOGLE_API_KEY = "AIzaSyC_2wVlffhsUiFFqkWbKw2jVex_6OCMSOM";

export default class Map extends Component {

  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

  constructor(props) {
    super(props);
    this.state = { width: 1, height: 1 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    console.log("width = " + window.innerWidth + ", heigth = " + window.innerHeight)
  }

  render() {
    const markers = this.props.markerList.map(m => <AnyReactComponent id={m.lat + m.lng} lat={m.lat} lng={m.lng} icon={'*'}/>)

    return (
      <div style={{width: this.state.width*0.5 + "px", height: this.state.height*0.8 + "px"}}>
        <GoogleMapReact
          bootstrapURLKeys={{key:GOOGLE_API_KEY}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          heatmapLibrary={true}
          heatmap={{
            positions: 
              this.props.markerList,
            options: {
              radius: 20,
              opacity: 0.7,
              gradient: [
                'rgba(0, 255, 255, 0)',
                'rgba(0, 255, 255, 1)',
                'rgba(0, 191, 255, 1)',
                'rgba(0, 127, 255, 1)',
                'rgba(0, 63, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 0, 223, 1)',
                'rgba(0, 0, 191, 1)',
                'rgba(0, 0, 159, 1)',
                'rgba(0, 0, 127, 1)',
                'rgba(63, 0, 91, 1)',
                'rgba(127, 0, 63, 1)',
                'rgba(191, 0, 31, 1)',
                'rgba(255, 0, 0, 1)'
              ]
            },
          }}
        >

            {markers}

        </GoogleMapReact>
      </div>
    );
  }
}