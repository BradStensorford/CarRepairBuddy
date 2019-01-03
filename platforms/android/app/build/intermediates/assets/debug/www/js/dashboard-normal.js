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

var imga = document.getElementById("InputProfilePic");
var d1 = document.getElementById("InputFirstName");
var d2 = document.getElementById("InputMiddleName");
var d3 = document.getElementById("InputLastName");
var d4 = document.getElementById("InputContactNumber");
var d5 = document.getElementById("InputHomeAddress");

var btnEdit = document.getElementById("btnDashNormEdit");
var btnSave = document.getElementById("btnDashNormSave");

dbRef.child("Users").child(getUserID).on('value', function(snapshot) {

    d1.value = snapshot.val().users_firstName;
    d2.value = snapshot.val().users_middleName;
    d3.value = snapshot.val().users_lastName;
    d4.value = snapshot.val().users_conNum;
    d5.value = snapshot.val().users_homeAdd;

    document.getElementById("smallImage").setAttribute("src", snapshot.val().users_imageProfile);
});

$("#btnDashNormEdit").click(function() {
    if (btnEdit.style.display = "block") {
        $("#btnDashNormEdit").attr("style", "display:none;");
        $("#btnDashNormSave").attr("style", "display:block;");

        $("#InputProfilePic").removeAttr("disabled");
        $("#InputFirstName").removeAttr("disabled");
        $("#InputMiddleName").removeAttr("disabled");
        $("#InputLastName").removeAttr("disabled");
        $("#InputContactNumber").removeAttr("disabled");
        $("#InputHomeAddress").removeAttr("disabled");
    }
});

$("#btnDashNormSave").click(function() {
    if (btnSave.style.display = "block") {

        if (selectedImage == null) {

            if (d1.value.trim() == "" ||
                d2.value.trim() == "" ||
                d3.value.trim() == "" ||
                d4.value.trim() == "" ||
                d5.value.trim() == "") {

                alert("Please fill all the content.");

            } else {
                $(".overlay").attr("style", "display:block");
                dbRef.child("Users").child(getUserID).update({
                    users_firstName: d1.value,
                    users_middleName: d2.value,
                    users_lastName: d3.value,
                    users_homeAdd: d5.value,
                    users_conNum: d4.value

                }).then(function() {
                    $("#btnDashNormEdit").attr("style", "display:block;");
                    $("#btnDashNormSave").attr("style", "display:none;");

                    $(".overlay").attr("style", "display:none");

                    $("#InputProfilePic").attr("disabled", "disabled");
                    $("#InputFirstName").attr("disabled", "disabled");
                    $("#InputMiddleName").attr("disabled", "disabled");
                    $("#InputLastName").attr("disabled", "disabled");
                    $("#InputContactNumber").attr("disabled", "disabled");
                    $("#InputHomeAddress").attr("disabled", "disabled");
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
                        users_homeAdd: d5.value,
                        users_conNum: d4.value,
                        users_imageProfile: downloadURL
                    }).then(function() {
                        $("#btnDashNormEdit").attr("style", "display:block;");
                        $("#btnDashNormSave").attr("style", "display:none;");

                        $("#InputProfilePic").attr("disabled");
                        $("#InputFirstName").attr("disabled");
                        $("#InputMiddleName").attr("disabled");
                        $("#InputLastName").attr("disabled");
                        $("#InputContactNumber").attr("disabled");
                        $("#InputHomeAddress").attr("disabled");
                    });
                });
            });

        }

    }
});