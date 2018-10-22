//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

//FIREBASE REFERENCE FOR STORAGE
var storage = firebase.storage();
var storageRef = storage.ref();

//SELECTED IMAGE TO BE UPLOAD
var selectedImage;

var getUserID = window.localStorage.getItem("loginUserId");

var businessStoreRef = dbRef.child("BusinessLocations");
var geoFire = new GeoFire(businessStoreRef);

var imga = document.getElementById("InputProfilePic");
var d1 = document.getElementById("InputFirstName");
var d2 = document.getElementById("InputMiddleName");
var d3 = document.getElementById("InputLastName");
var d4 = document.getElementById("InputContactNumber");
var d5 = document.getElementById("InputBusinessAddress");
var d6 = document.getElementById("InputLat");
var d7 = document.getElementById("InputLon");
var d8 = document.getElementById("InputBusinessName");
var d9 = document.getElementById("InputWebUrl");
var d10 = document.getElementById("InputBusinessHours");
var d11 = document.getElementById("InputSelectBusinessType");
var d13 = document.getElementById("InputEmail");

var btnEdit = document.getElementById("btnDashEdit");
var btnSave = document.getElementById("btnDashSave");


dbRef.child("Users").child(getUserID).on('value', function(snapshot) {
    d1.value = snapshot.val().users_firstName;
    d2.value = snapshot.val().users_middleName;
    d3.value = snapshot.val().users_lastName;
    d13.value = snapshot.val().users_emailAdd;
    document.getElementById("smallImage").setAttribute("src", snapshot.val().users_imageProfile);
});

dbRef.child("BusinessStores").child(getUserID).on('value', function(snapshot) {
    d8.value = snapshot.val().business_name;
    d10.value = snapshot.val().business_hours;
    d9.value = snapshot.val().business_website;
    d4.value = snapshot.val().business_contactNumber;
    d5.value = snapshot.val().business_address;
    $("#InputSelectBusinessType").selectpicker('val', (snapshot.val().business_types).split(","));
});

geoFire.get(getUserID).then(function(location) {
    d6.value = location[0];
    d7.value = location[1];
}, function(error) {
    console.log("Error: " + error);
});

$("#btnDashEdit").click(function() {
    if (btnEdit.style.display = "block") {
        $("#btnDashEdit").attr("style", "display:none;");
        $("#btnDashSave").attr("style", "display:block;");

        $("#InputProfilePic").removeAttr("disabled");
        $("#InputFirstName").removeAttr("disabled");
        $("#InputMiddleName").removeAttr("disabled");
        $("#InputLastName").removeAttr("disabled");
        $("#InputContactNumber").removeAttr("disabled");
        $("#InputBusinessAddress").removeAttr("disabled");
        $("#InputLat").removeAttr("disabled");
        $("#InputLon").removeAttr("disabled");
        $("#InputBusinessName").removeAttr("disabled");
        $("#InputWebUrl").removeAttr("disabled");
        $("#InputBusinessHours").removeAttr("disabled");
        $("#InputEmail").removeAttr("disabled");

        $('#InputSelectBusinessType').prop('disabled', false);
        $('#InputSelectBusinessType').selectpicker('refresh');
    }
});


$("#btnDashSave").click(function() {
    if (btnSave.style.display = "block") {
        $("#btnDashEdit").attr("style", "display:block;");
        $("#btnDashSave").attr("style", "display:none;");

        var webUrl;

        //WEB URL
        if (d9.value.trim() != "") {
            webUrl = d9.value.trim();
        } else if (d9.value.trim() == "") {
            webUrl = "No Website Given";
        }

        if (selectedImage == null) {

            if (
                d1.value.trim() == "" ||
                d2.value.trim() == "" ||
                d3.value.trim() == "" ||
                d4.value.trim() == "" ||
                d5.value.trim() == "" ||
                d6.value.trim() == "" ||
                d7.value.trim() == "" ||
                d8.value.trim() == "" ||
                d9.value.trim() == "" ||
                d10.value.trim() == "" ||
                getSelectValues(d11).join() == "") {
                alert("Please fill all the content.");

            } else {
                $(".overlay").attr("style", "display:block");

                dbRef.child("Users").child(getUserID).update({
                    users_firstName: d1.value,
                    users_middleName: d2.value,
                    users_lastName: d3.value
                });

                var fullname = d1.value + " " + d2.value.charAt(0) + ". " + d3.value;

                geoFire.remove(getUserID);

                var latlng = JSON.parse("[" + d6.value + "," + d7.value + "]");
                geoFire.set(getUserID, latlng).then(function() {
                    console.log("Provided keys have been added to GeoFire");
                }, function(error) {
                    console.log("Error: " + error);
                });

                dbRef.child("BusinessStores").child(getUserID).update({
                    business_owner: fullname,
                    business_name: d8.value,
                    business_hours: d10.value,
                    business_types: getSelectValues(d11).join(),
                    business_website: webUrl,
                    business_address: d5.value,
                    business_contactNumber: d4.value

                }).then(function() {
                    $(".overlay").attr("style", "display:none;");
                    $("#InputProfilePic").attr("disabled", "disabled");
                    $("#InputFirstName").attr("disabled", "disabled");
                    $("#InputMiddleName").attr("disabled", "disabled");
                    $("#InputLastName").attr("disabled", "disabled");
                    $("#InputContactNumber").attr("disabled", "disabled");
                    $("#InputBusinessAddress").attr("disabled", "disabled");
                    $("#InputLat").attr("disabled", "disabled");
                    $("#InputLon").attr("disabled", "disabled");
                    $("#InputBusinessName").attr("disabled", "disabled");
                    $("#InputWebUrl").attr("disabled", "disabled");
                    $("#InputBusinessHours").attr("disabled", "disabled");
                    $("#InputEmail").attr("disabled", "disabled");

                    $('#InputSelectBusinessType').prop('disabled', true);
                    $('#InputSelectBusinessType').selectpicker('refresh');
                    alert("Settings Saved");
                });

            }

        } else {
            //IMAGE FILE NAME TO BE UPLOADED
            var fileName = selectedImage.name;
            //IMAGE STORAGE REFERENCE
            var imageStore = storageRef.child('profilepic/' + Date.now() + "_" + fileName);
            //IMAGE TASK UPLOAD
            var taskUpload = imageStore.put(selectedImage);

            taskUpload.on('state_changed', function(snapshot) {
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        $(".overlay").attr("style", "display:block;");
                        console.log('Upload is running');
                        break;
                }
            }, function(err) {
                console.log(err);

            }, function() {

                taskUpload.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                    dbRef.child("Users").child(getUserID).update({
                        users_firstName: d1.value,
                        users_middleName: d2.value,
                        users_lastName: d3.value,
                        users_imageProfile: downloadURL
                    });

                    var fullname = d1.value + " " + d2.value.charAt(0) + ". " + d3.value;

                    geoFire.remove(getUserID);

                    var latlng = JSON.parse("[" + d6.value + "," + d7.value + "]");
                    geoFire.set(getUserID, latlng).then(function() {
                        console.log("Provided keys have been added to GeoFire");
                    }, function(error) {
                        console.log("Error: " + error);
                    });

                    dbRef.child("BusinessStores").child(getUserID).update({
                        business_owner: fullname,
                        business_name: d8.value,
                        business_hours: d10.value,
                        business_types: getSelectValues(d11).join(),
                        business_website: webUrl,
                        business_address: d5.value,
                        business_contactNumber: d4.value,
                        business_image: downloadURL

                    }).then(function() {
                        $(".overlay").attr("style", "display:none;");
                        $("#InputProfilePic").attr("disabled", "disabled");
                        $("#InputFirstName").attr("disabled", "disabled");
                        $("#InputMiddleName").attr("disabled", "disabled");
                        $("#InputLastName").attr("disabled", "disabled");
                        $("#InputContactNumber").attr("disabled", "disabled");
                        $("#InputBusinessAddress").attr("disabled", "disabled");
                        $("#InputLat").attr("disabled", "disabled");
                        $("#InputLon").attr("disabled", "disabled");
                        $("#InputBusinessName").attr("disabled", "disabled");
                        $("#InputWebUrl").attr("disabled", "disabled");
                        $("#InputBusinessHours").attr("disabled", "disabled");
                        $("#InputEmail").attr("disabled", "disabled");

                        $('#InputSelectBusinessType').prop('disabled', true);
                        $('#InputSelectBusinessType').selectpicker('refresh');
                        alert("Settings Saved");
                    });
                });
            });
        }
    }
});

//FOR IMAGE UPLOAD PREVIEW
function preview_image(event) {
    selectedImage = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function() {
        var output = document.getElementById('smallImage');
        output.src = reader.result;
    }
    reader.readAsDataURL(selectedImage);
}

// Return an array of the selected opion values
// select is an HTML select element
function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];
        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}