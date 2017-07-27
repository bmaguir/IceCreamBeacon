const POST_BEACON_PATH = "/api/Beacon";
const GET_BEACON_PATH = "/api/Beacon";
const GOOGLE_API_KEY = "AIzaSyC_2wVlffhsUiFFqkWbKw2jVex_6OCMSOM";
const GOOGLE_GEO_API_KEY = "AIzaSyA10isfCBC5gSTi-s4zw_YTQF1p4AkP8Gs";

(function() {
    'use strict';

    var geoLocator = {
        location: {lat: null, lng: null},
        address: null,
        initialize: function() {},
        cityName: "",
        getLocation: function(callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    geoLocator.location['lat'] = position.coords.latitude;
                    geoLocator.location['lng'] = position.coords.longitude;
                    callback();
                });
            } else {
                console.log("Geolocation is not supported by this browser.");
            }
        },
        getCity: function(lat, lng, callback){
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+
            lat + "," + lng + "&key=" + GOOGLE_GEO_API_KEY + "&location_type=APPROXIMATE"
            $.get(url, function(data, status){
                if(status == 'success'){
                    console.log(data);
                    console.log(data.results[0].address_components[0].short_name);
                    for(var i=0; i<data.results.length; i++){
                        for(var j=0; j<data.results[i].address_components.length; j++){
                            for(var k=0; k<data.results[i].address_components[j].types.length; k++){
                                if(data.results[i].address_components[j].types[k] == "administrative_area_level_1"){
                                    app.myGeoLocator.cityName = data.results[i].address_components[j].short_name;
                                    console.log(app.myGeoLocator.cityName)
                                    break;
                                }
                            }
                        }

                    }
                    geoLocator.address = data.results[0].address_components[0].short_name;
                    callback();
                }
                else{
                    var toast_text = "Something Went Wrong :("
                    Materialize.toast(toast_text, 4000);
                }
            })
        }
    };
    var app = {
        initialize: function() {
            console.log("In Initialize");
            this.bindEvents();
            app.myGeoLocator.getLocation(function(){
                app.myMap.initMap();
                app.myGeoLocator.getCity(app.myGeoLocator.location.lat, app.myGeoLocator.location.lng, app.getBeacons);
            });
        },
        hasRequestPending: false,
        bindEvents: function() {
            console.log("Binding Events");
            document.getElementById("icecreambutton").addEventListener("click", this.onButtonPressed, false);
            $(document).ready(app.onDeviceReady);
        },
        onDeviceReady: function() {
        },
        myGeoLocator: geoLocator,
        onButtonPressed: function(){
            console.log("Button Pressed");
            app.myGeoLocator.getLocation(function(){
                if(app.myGeoLocator.cityName == ""){
                    app.myGeoLocator.getCity(app.myGeoLocator.location.lat, app.myGeoLocator.location.lng, app.sendBeacon);
                }
                else{
                    app.sendBeacon();
                }
            });
        },
        myMap:{
            markers: [],
            map: map,
            initMap: function() {
                console.log("lat : " + app.myGeoLocator.location.lat + " , lng : " + app.myGeoLocator.location.lng);
                var home = new google.maps.LatLng(app.myGeoLocator.location.lat, app.myGeoLocator.location.lng);
                app.myMap.map = new google.maps.Map(document.getElementById('map'), {
                  zoom: 13,
                  center: home,
                  mapTypeId: google.maps.MapTypeId.ROADMAP
                  //disableDefaultUI: true
                });
                console.log("my map = ");
                console.log(app.myMap.map.getZoom());
            },
            addMarker: function(location) {
                var marker = new google.maps.Marker({
                  position: location,
                  map: app.myMap.map
                });
                app.myMap.markers.push(marker);
            },
            setMapOnAll: function(map) {
                for (var i = 0; i < app.myMap.markers.length; i++) {
                  app.myMap.markers[i].setMap(app.myMap.map);
                }
            },
            clearMarkers: function() {
                app.myMap.setMapOnAll(null);
            },
            deleteMarkers: function(){
                app.myMap.clearMarkers();
                app.myMap.markers = [];
            },
            drawPoints: function(points){
                console.log(points);
                app.myMap.deleteMarkers();
                for(var i=0; i< points.length; i++){
                    var position = new google.maps.LatLng(points[i].location.lat, points[i].location.lng);
                    app.myMap.addMarker(position);
               }
               app.myMap.setMapOnAll(app.myMap.map);
            },
        },
        getBeacons: function(){
            var host = window.location.hostname;
            var location = app.myGeoLocator.location;
            var url = GET_BEACON_PATH
            var sendData = {
                "latitude": location['lat'],
                "longitude": location['lng'],
                "city": app.myGeoLocator.cityName,
            }
            console.log(sendData);
            $.get(url, sendData, function(data, status){
                if(status == 'success'){
                    console.log(data);
                    app.myMap.drawPoints(JSON.parse(data));
            }
            else{
                console.log("error");
            }
            })
        },
        sendBeacon: function() {
            var host = window.location.hostname;
            var location = app.myGeoLocator.location;
            var url = POST_BEACON_PATH
            var complaintData = {
                "latitude": location['lat'],
                "longitude": location['lng'],
                location: location,
                "city": app.myGeoLocator.cityName,
                "address": geoLocator.address
            }
            console.log(complaintData)
            console.log("sending beacon to " + url)
            $.post(url, complaintData, app.returnFromSend)
        },
        returnFromSend: function(data, status) {
            if(status == 'success'){
                var toast_text = "Sent Beacon";
            }
            else{
                var toast_text = "Something Went Wrong :("
            }
            Materialize.toast(toast_text, 4000);
        }
    };
    var errorCallback = function(e) {
        console.log('Reeeejected!', e);
    };
    app.initialize();
})();
