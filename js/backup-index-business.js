/*VARIABLES*/
var buttonInA = document.querySelector("#dismiss");
var buttonInB = document.querySelector(".overlay");
var buttonOut = document.getElementById("sidebarCollapse");

var dbRef = firebase.database().ref();
var geoFireTest = new GeoFire(dbRef.child("BusinessLocations"));

var listService = [];
var listParts = [];
var listTowing = [];
var listAll = [];

var allForOffline = [];

document.addEventListener("deviceready", function() {

    var div = document.getElementById("map_canvas");
    var map = plugin.google.maps.Map.getMap(div, {
        'controls': {
            'compass': false,
            'myLocationButton': false,
            'indoorPicker': false,
            'zoom': true
        }
    });
    map.one(plugin.google.maps.event.MAP_READY, onMapInit);

    /* ------------------------------
    FOR MAP VIEW MENU CLICK
    ---------------------------------*/

    buttonInA.addEventListener("click", function() {
        map.setVisible(true);
    });

    buttonInB.addEventListener("click", function() {
        map.setVisible(true);
    });

    buttonOut.addEventListener("click", function() {
        map.setVisible(false);
    });

}, false);

function saveForOffline() {
    window.localStorage.removeItem("allForOffline");

    dbRef.child("BusinessStores").on('value', function(snapshot) {
        snapshot.forEach(function(childsnapshot) {
            var result1 = childsnapshot.val().business_address;
            var result2 = childsnapshot.val().business_contactNumber;
            var result3 = childsnapshot.val().business_emailAdd;
            var result4 = childsnapshot.val().business_hours;
            var result5 = childsnapshot.val().business_image;
            var result6 = childsnapshot.val().business_name;
            var result7 = childsnapshot.val().business_owner;
            var result8 = childsnapshot.val().business_types;
            var result9 = childsnapshot.val().business_website;

            var overallresult = {
                'business_address': result1,
                'business_contactNumber': result2,
                'business_emailAdd': result3,
                'business_hours': result4,
                'business_image': result5,
                'business_name': result6,
                'business_owner': result7,
                'business_types': result8,
                'business_website': result9
            };

            //console.log(overallresult);
            allForOffline.push(overallresult);
            console.log(overallresult);
            console.log("Data");
        });

        window.localStorage.setItem('allForOffline', JSON.stringify(allForOffline));
        console.log("Storing success.");
    });
}

function onMapInit(googleMap) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var radiusSet = window.localStorage.getItem("radiusSettings");
        var dlat = position.coords.latitude;
        var dlon = position.coords.longitude;

        mylocationmarker(position, googleMap, radiusSet);
        getLocation(dlat, dlon, radiusSet, googleMap);

        $("#button_filter").click(function() {
            var selectData = $("#select_filter").selectpicker('val');

            if (selectData == "All") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                selectSourceMarker(listAll, googleMap);

            } else if (selectData == "Parts") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                selectSourceMarker(listParts, googleMap);

            } else if (selectData == "Services") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                selectSourceMarker(listService, googleMap);

            } else if (selectData == "Towing") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                selectSourceMarker(listTowing, googleMap);

            } else {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                selectSourceMarker(listAll, googleMap);
            }
        });

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
        icon: 'blue',
        title: "My Location."
    });

    var circle = map.addCircle({
        center: marker.getPosition(),
        radius: radiusVar * 1000,
        fillColor: "rgba(0, 0, 0, 0.2)",
        strokeColor: "rgba(0, 0, 255, 0.5)",
        strokeWidth: 1
    });

    // circle.center = marker.position
    marker.bindTo("position", circle, "center");
    map.moveCamera({
        target: { lat: locationlat, lng: locationlon },
        zoom: 15
    });
}



function getLocation(dlat, dlon, radiusVar, map) {

    var geoQuery;
    var operation;

    if (typeof geoQuery !== "undefined") {
        operation = "Updating";

        geoQuery.updateCriteria({
            center: [parseFloat(dlat), parseFloat(dlon)],
            radius: praseFloat(radiusVar)
        });

    } else {
        operation = "Creating";

        geoQuery = geoFireTest.query({
            center: [parseFloat(dlat), parseFloat(dlon)],
            radius: parseFloat(radiusVar)
        });

        geoQuery.on("key_entered", function(key, location, distance) {
            dbRef.child("BusinessStores").child(key).on('value', function(snapshot) {

                var typesIndicator = snapshot.val().business_types.toString();
                var name_owner = snapshot.val().business_name;

                if (typesIndicator.includes("Parts")) {
                    listParts.push({
                        position: { lat: location[0], lng: location[1] },
                        icon: 'yellow',
                        title: name_owner,
                        snippet: distance.toFixed(2) + "km distance from your location."
                    });
                }

                if (typesIndicator.includes("Services")) {
                    listService.push({
                        position: { lat: location[0], lng: location[1] },
                        icon: 'green',
                        title: name_owner,
                        snippet: distance.toFixed(2) + "km distance from your location."
                    });
                }

                if (typesIndicator.includes("Towing")) {
                    listTowing.push({
                        position: { lat: location[0], lng: location[1] },
                        icon: 'rgb(146,98,57)',
                        title: name_owner,
                        snippet: distance.toFixed(2) + "km distance from your location."
                    });
                }

                listAll.push({
                    position: { lat: location[0], lng: location[1] },
                    icon: 'red',
                    title: name_owner,
                    snippet: distance.toFixed(2) + "km distance from your location."
                });

                map.addMarker({
                    position: { lat: location[0], lng: location[1] },
                    icon: 'red',
                    title: name_owner,
                    snippet: distance.toFixed(2) + "km distance from your location."
                });

            });
        });
    }
}

function selectSourceMarker(list, map) {
    var marker;

    for (var i = 0; i <= list.length - 1; i++) {
        marker = map.addMarker(list[i]);
    }
}