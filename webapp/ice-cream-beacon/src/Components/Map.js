import GoogleMapReact from 'google-map-react';
import React, {Component} from 'react';
import axios from 'axios'

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const GOOGLE_API_KEY = "AIzaSyC_2wVlffhsUiFFqkWbKw2jVex_6OCMSOM";
const GET_BEACON_PATH = "/api/Beacon";
const DEFAULT_CITY = "Dublin"

const TEST_MARKERS = [
  {'location': {'lat': 53.38299530795734, 'lng': -6.244525906923855}},
  {'location': {'lat': 53.35380424853437, 'lng': -6.273193356875026}}
]

export default class Map extends Component {

  static defaultProps = {
    center: {lat: 59.95, lng: 30.33},
    zoom: 11
  };

  constructor(props) {
    super(props);
    this.state = { width: 1, height: 1, city: DEFAULT_CITY, markerList: []};
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getBeacons = this.getBeacons.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.getBeacons()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    console.log("width = " + window.innerWidth + ", heigth = " + window.innerHeight)
  }

  getBeacons(){
    const host = window.location.hostname;
    var location = this.props.center
    var url = GET_BEACON_PATH
    var sendData = {
        "latitude": location['lat'],
        "longitude": location['lng'],
        "city": this.state.city
    }
    console.log(sendData);
    axios.get(url, {params: sendData})
    .then(response => {
      if(response.status == 200 && response.data){
        this.setState({markerList: response.data})
      }
      console.log(response);
    })
    //this.setState({markerList: TEST_MARKERS})
}

  render() {
    const markers = this.state.markerList.map(
       l=> { 
         return (<AnyReactComponent 
         id={l.location.lat + l.location.lng} 
         lat={l.location.lat} 
         lng={l.location.lng} 
         icon={'*'}
         />)
       }
        );
    const heatmapLocatons = this.state.markerList.map(
      l => {
        return l.location
      }
    );

    return (
      <div style={{width: this.state.width*0.5 + "px", height: this.state.height*0.8 + "px"}}>
        <GoogleMapReact
          bootstrapURLKeys={{key:GOOGLE_API_KEY}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          heatmapLibrary={true}
          heatmap={{
            positions: 
              heatmapLocatons,
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