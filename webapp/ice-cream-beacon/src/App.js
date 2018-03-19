import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Col, Container, Row, Button, Card, CardBody, CardTitle} from 'reactstrap';
import {geolocated} from 'react-geolocated';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import Map from './Components/Map';

const DEFAULT_LOCATION = {'lat': 53.38299530795734, 'lng': -6.244525906923855}
const POST_BEACON_PATH = "/api/Beacon";
const DEFAULT_CITY = "Dublin"


const TEST_MARKERS = [{'lat': 53.38299530795734, 'lng': -6.244525906923855}, {'lat': 53.35380424853437, 'lng': -6.273193356875026}]

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {locationSet: false, markerList: TEST_MARKERS};
    this.getIsLocationAvaiabel = this.getIsLocationAvaiabel.bind(this)
    this.sendBeacon = this.sendBeacon.bind(this)
  }

  getIsLocationAvaiabel() {
    return (this.props.isGeolocationAvailable && this.props.coords)
  }

  sendBeacon(){
    console.log(this.getIsLocationAvaiabel())
    if(this.getIsLocationAvaiabel){
      const host = window.location.hostname;
      const location = this.props.coords
      const url = POST_BEACON_PATH
      const data = {
          "latitude": location['latitude'],
          "longitude": location['longitude'],
          location: {"lat": location['latitude'], "lng": location['longitude']},
          "city": DEFAULT_CITY
      }
      console.log("sending beacon to " + url);
      axios.post(url, {params: data})
      .then(function (response) {
        if(response.status == 200 && response.data){
          //this.setState({markerList: response.data})
          toast.success("Sent Ice Cream Beacon");
        }
        console.log(response);
      })
  }
  else{
    toast.error("Location not set");
  }
  }

  render() {

    var appLocation = DEFAULT_LOCATION;
    if (this.props.isGeolocationAvailable && this.props.coords){
      appLocation = {'lat': this.props.coords.latitude, 'lng': this.props.coords.longitude};
    }
    console.log(this.props.isGeolocationAvailable)
    return (
      <div className="App">
      <ToastContainer />
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
        <Container>
        <Row>
            <Col>
            <Button color="success" onClick={this.sendBeacon}>
              I Want IceCream
            </Button>
            </Col>
          </Row>
          <Row>
            <Col>
            <Card>
              <CardBody >
                <Map isMarkerShown={true} center={appLocation} markerList={this.state.markerList}/>
              </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(App);