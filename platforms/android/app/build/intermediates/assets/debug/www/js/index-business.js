document.addEventListener('DOMContentLoaded', (function() {
    link = new SMSLink.link();
    link.replaceAll();
}), false);

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

    $("#select_filter .selectpicker").val("All");
    $("#select_filter").selectpicker('refresh');

}, false);

function saveForOffline() {
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
        getAllMarkers(dlat, dlon, radiusSet, googleMap);

        $("#button_filter").click(function() {
            var selectData = $("#select_filter").selectpicker('val');

            if (selectData == "All") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                getAllMarkers(dlat, dlon, radiusSet, googleMap);

            } else if (selectData == "Parts") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                getPartsMarkers(dlat, dlon, radiusSet, googleMap);

            } else if (selectData == "Services") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                getServiceMarkers(dlat, dlon, radiusSet, googleMap);

            } else if (selectData == "Towing") {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                getTowingMarkers(dlat, dlon, radiusSet, googleMap);

            } else {
                googleMap.clear();
                mylocationmarker(position, googleMap, radiusSet);
                getAllMarkers(dlat, dlon, radiusSet, googleMap);
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



function getAllMarkers(dlat, dlon, radiusVar, map) {

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
                var name_owner = snapshot.val().business_name;

                map.addMarker({
                    position: { lat: location[0], lng: location[1] },
                    icon: 'red',
                    title: name_owner,
                    snippet: distance.toFixed(2) + "km distance from your location.",
                    item: snapshot.key
                }, function(marker) {
                    marker.on(plugin.google.maps.event.INFO_CLICK, function() {
                        onInfoClicked(marker.get("item"));
                    });
                });
            });
        });
    }
}

function getPartsMarkers(dlat, dlon, radiusVar, map) {

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
                    map.addMarker({
                        position: { lat: location[0], lng: location[1] },
                        icon: 'yellow',
                        title: name_owner,
                        snippet: distance.toFixed(2) + "km distance from your location.",
                        itemKey: snapshot.key
                    }, function(marker) {
                        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
                            onInfoClicked(marker.get("itemKey"));
                        });
                    });
                }
            });
        });
    }
}

function getServiceMarkers(dlat, dlon, radiusVar, map) {

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

                if (typesIndicator.includes("Services")) {
                    map.addMarker({
                        position: { lat: location[0], lng: location[1] },
                        icon: 'green',
                        title: name_owner,
                        snippet: distance.toFixed(2) + "km distance from your location.",
                        item: snapshot.key
                    }, function(marker) {
                        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
                            onInfoClicked(marker.get("item"));
                        });
                    });
                }
            });
        });
    }
}

function getTowingMarkers(dlat, dlon, radiusVar, map) {

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

                if (typesIndicator.includes("Towing")) {
                    map.addMarker({
                        position: { lat: location[0], lng: location[1] },
                        icon: 'rgb(146,98,57)',
                        title: name_owner,
                        snippet: distance.toFixed(2) + "km distance from your location.",
                        item: snapshot.key
                    }, function(marker) {
                        marker.on(plugin.google.maps.event.INFO_CLICK, function() {
                            onInfoClicked(marker.get("item"));
                        });
                    });
                }
            });
        });
    }
}

function onInfoClicked(id) {
    $("#profileModal").modal("show");
    $('#profileModal').on('shown.bs.modal', function(e) {
        dbRef.child("BusinessStores").child(id).on('value', function(snapshot) {
            $("#businessImage").attr('src', snapshot.val().business_image);
            $("#businessName").val(snapshot.val().business_name);
            $("#businessAddress").val(snapshot.val().business_address);
            $("#businessHours").val(snapshot.val().business_hours);
            $("#businessWebsite").val(snapshot.val().business_website);
            $("#businessEmail").val(snapshot.val().business_emailAdd);

            phoneOrTel(snapshot.val().business_contactNumber);

            var typesIndicator = snapshot.val().business_types.toString();
            if (typesIndicator.includes("Services")) {
                dbRef.child("ShopOverallServices").orderByChild("serviceOwner").equalTo(id).on('value', function(snapshot) {
                    if (snapshot.exists()) {
                        $("#services_div").attr("style", "display:block;");

                        var serviceArea = [];
                        snapshot.forEach(function(childsnapshot) {
                            serviceArea.push(childsnapshot.val().serviceName);
                        });

                        var SAresult = serviceArea.join("\n");
                        $("#businessService").val(SAresult);

                    } else {
                        $("#services_div").attr("style", "display:none;");
                        $("#businessService").val("");
                    }
                });
            }

            if (typesIndicator.includes("Towing")) {
                dbRef.child("ShopOverallTowing").child(id).on('value', function(snapshot) {
                    if (snapshot.exists()) {
                        $("#towing_div").attr("style", "display:block;");

                        var result = snapshot.val().towingDesc;
                        $("#businessTowing").val(result);

                    } else {
                        $("#towing_div").attr("style", "display:none;");
                        $("#businessTowing").val("");
                    }
                });
            }

        });
    });
}


function closeModal() {
    $("#businessImage").attr('src', 'img/image.png');
    $("#businessName").val("");
    $("#businessAddress").val("");
    $("#businessHours").val("");
    $("#businessWebsite").val("");
    $("#businessEmail").val("");
    $("#contact_ul").empty();
    $("#businessService").val("");
    $("#businessTowing").val("");
    $(".modal").modal('hide');
}


function phoneOrTel(stringValue) {

    var datalists = $(".itm.cnumber");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };


    if (stringValue != "not indicated") {
        var number = stringValue.split(",");
        for (var i = 0; i < number.length; i++) {

            var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + number[i] + '"><div class="input-group-btn"><a href="tel:' + number[i] + '" class="btn btn-primary"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' + number[i] + '" class="btn btn-success"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';

            $("#contact_ul").append(datavalue);
        }
    } else {
        var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + stringValue + '"><div class="input-group-btn"><a href="tel:' + stringValue + '" class="btn btn-primary" disabled="disabled"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' +stringValue + '" class="btn btn-success" disabled="disabled"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';
        $("#contact_ul").append(datavalue);
    }

}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}