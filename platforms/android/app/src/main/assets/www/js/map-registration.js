var chooseMap = false;
var triggerSelectMap = function() {
    if (!chooseMap) {
        $("#text-header").html("SELECT LOCATION");
        $("#data-content-map").css("position", "relative");
        map.setVisible(true);
        $("#data-content-norm").css("display", "none");
    }
    else {
        $("#text-header").html("SIGN UP");
        $("#data-content-map").css("position", "absolute");
        map.setVisible(false);
        $("#data-content-norm").css("display", "block");
    }
    chooseMap = !chooseMap;
}

var map;
document.addEventListener("deviceready", function() {

    var div = document.getElementById("map_canvas");
    map = plugin.google.maps.Map.getMap(div, {
        'controls': {
            'compass': true,
            'myLocationButton': false,
            'indoorPicker': false,
            'zoom': true
        }
    });
    console.log(map);
    map.one(plugin.google.maps.event.MAP_READY, onMapInit);
    map.setVisible(false);
    map.on(plugin.google.maps.event.MAP_CLICK, function(latLng) {
      console.log(latLng + " is clicked!");
      $("#InputLat").val(latLng.lat);
      $("#InputLon").val(latLng.lng);
      if(chooseMap) {
        triggerSelectMap();
      }
      else {
        triggerSelectMap();
      }
    });
}, false);

function onMapInit(googleMap) {
    navigator.geolocation.getCurrentPosition(function(position) {
            var radiusSet = window.localStorage.getItem("radiusSettings");
            var dlat = position.coords.latitude;
            var dlon = position.coords.longitude;
            mylocationmarker(position, googleMap, radiusSet);

        }, function(error) {
            alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
        }, {
            timeout: 30000,
            enableHighAccuracy: true
        });
}

function mylocationmarker(position, map, radiusVar) {
     var locationlat = position.coords.latitude;
     var locationlon = position.coords.longitude;

     var marker = map.addMarker({
         position: { lat: locationlat, lng: locationlon },
         icon: 'red',
         title: "You are here"
     });

     map.moveCamera({
         target: { lat: locationlat, lng: locationlon },
         zoom: 15
     });
 }

 function placemarker(position, map, radiusVar) {
     var locationlat = position.coords.latitude;
     var locationlon = position.coords.longitude;

     var marker = map.addMarker({
         position: { lat: locationlat, lng: locationlon },
         icon: 'blue',
         title: "Your proposed location"
     });

     map.moveCamera({
         target: { lat: locationlat, lng: locationlon },
         zoom: 15
     });
 }