import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Col, Container, Row, Button, Card, CardBody, CardTitle} from 'reactstrap';
import {geolocated} from 'react-geolocated';
import Map from './Components/Map';

const DEFAULT_LOCATION = {'lat': 53.38299530795734, 'lng': -6.244525906923855}

const TEST_MARKERS = [{'lat': 53.38299530795734, 'lng': -6.244525906923855}, {'lat': 53.35380424853437, 'lng': -6.273193356875026}]

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {locationSet: false, markerList: TEST_MARKERS};
  }

  getIsLocationAvaiabel() {
    return (this.props.isGeolocationAvailable && this.props.coords)
  }

  render() {

    var appLocation = DEFAULT_LOCATION;
    if (this.props.isGeolocationAvailable && this.props.coords){
      appLocation = {'lat': this.props.coords.latitude, 'lng': this.props.coords.longitude};
    }
    console.log(this.props.isGeolocationAvailable)
    return (
      <div className="App">
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> */}
        <Container>
        <Row>
            <Col>
            <Button color="success">
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