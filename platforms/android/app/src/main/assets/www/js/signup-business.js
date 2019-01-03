// Initialize Firebase
var config = {
    apiKey: "AIzaSyAs4SbWKbWmmqory3mGq74U-TWj34rWPxw",
    authDomain: "carbuddy-1529808959227.firebaseapp.com",
    databaseURL: "https://carbuddy-1529808959227.firebaseio.com",
    projectId: "carbuddy-1529808959227",
    storageBucket: "carbuddy-1529808959227.appspot.com",
    messagingSenderId: "413000891924"
};
firebase.initializeApp(config);


//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

//FIREBASE REFERENCE FOR STORAGE
var storage = firebase.storage();
var storageRef = storage.ref();

//SELECTED IMAGE TO BE UPLOAD
var selectedImage;

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


$("#formUpData").bootstrapValidator({
    container: '#messages',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        inputImage: {
            validators: {
                notEmpty: {
                    message: 'Profile picture is required and cannot be empty'
                }
            }
        },
        inputFirstname: {
            validators: {
                notEmpty: {
                    message: 'First name is required and cannot be empty'
                }
            }
        },
        inputMiddlename: {
            validators: {
                notEmpty: {
                    message: 'Middle name is required and cannot be empty'
                }
            }
        },
        inputLastname: {
            validators: {
                notEmpty: {
                    message: 'Last name is required and cannot be empty'
                }
            }
        },
        inputPassword: {
            validators: {
                notEmpty: {
                    message: 'Password is required and cannot be empty'
                },
                stringLength: {
                    min: 6,
                    message: 'Password must be minimum of 6 characters'
                }
            }
        },
        inputLatitude: {
            validators: {
                notEmpty: {
                    message: 'Latitude is required and cannot be empty'
                }
            }
        },
        inputLongitude: {
            validators: {
                notEmpty: {
                    message: 'Longitude is required and cannot be empty'
                }
            }
        },
        inputContactNumber: {
            validators: {
                notEmpty: {
                    message: 'Contact Number is required and cannot be empty'
                }
            }
        },
        inputEmail: {
            validators: {
                notEmpty: {
                    message: 'Email is required and cannot be empty'
                },
                emailAddress: {
                    message: 'Must be a valid Email address'
                }
            }
        },
        inputBusinessAddress: {
            validators: {
                notEmpty: {
                    message: 'Business Address is required and cannot be empty'
                }
            }
        },
        inputBusinessName: {
            validators: {
                notEmpty: {
                    message: 'Business Name is required and cannot be empty'
                }
            }
        },
        inputBusinessHours: {
            validators: {
                notEmpty: {
                    message: 'Business Hours is required and cannot be empty'
                }
            }
        },
        inputBusinessType: {
            validators: {
                notEmpty: {
                    message: 'Business Type is required and cannot be empty'
                }
            }
        }

    }
}).on('success.form.bv', function(e, data) {
    // Prevent form submission
    e.preventDefault();

    // Get the form instance
    var $form = $(e.target);

    // Get the BootstrapValidator instance
    var bv = $form.data('bootstrapValidator');

    var df1 = getFormData($form)["inputFirstname"];
    var df2 = getFormData($form)["inputMiddlename"];
    var df3 = getFormData($form)["inputLastname"];
    var df4 = getFormData($form)["inputPassword"];
    var df5 = getFormData($form)["inputLatitude"];
    var df6 = getFormData($form)["inputLongitude"];
    var df7 = getFormData($form)["inputContactNumber"];
    var df8 = getFormData($form)["inputEmail"];
    var df9 = getFormData($form)["inputBusinessAddress"];
    var df10 = getFormData($form)["inputBusinessName"];
    var df11 = getFormData($form)["inputBusinessHours"];
    var df12 = getFormData($form)["inputBusinessType"];


    if (confirm("Proceed?")) {

        firebase.auth().signInAnonymously().then(function() {

            var fileName = selectedImage.name;
            var imageStore = storageRef.child('profilepic/' + Date.now() + "_" + fileName);
            var taskUpload = imageStore.put(selectedImage);

            taskUpload.on('state_changed', function(snapshot) {
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        $(".overlay").attr("style", "display:block;");
                        console.log('Upload is running');
                        break;
                }
            }, function(err) {
                console.log(err);

            }, function() {

                taskUpload.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                    var userCurrent = firebase.auth().currentUser;
                    console.log(userCurrent.uid);
                    alert(userCurrent.email);
                    var webUrl;
                    if ($("InputWebUrl").val() == null || $("InputWebUrl").val() == "") {
                        webUrl = "No Website Given";
                    } else if ($("InputWebUrl").val() != null || $("InputWebUrl").val() != "") {
                        webUrl = $("InputWebUrl").val();
                    }


                    dbRef.child("PendingBusinessOwner").child(userCurrent.uid).set({
                        pendingFirstName: (decodeURIComponent(df1).split('+').join(' ')).trim(),
                        pendingMiddleName: (decodeURIComponent(df2).split('+').join(' ')).trim(),
                        pendingLastName: (decodeURIComponent(df3).split('+').join(' ')).trim(),
                        pendingPassword: df4.toString().trim(),
                        pendingLatitude: df5.toString().trim(),
                        pendingLongitude: df6.toString().trim(),
                        pendingWebsite: webUrl,
                        pendingContactNumber: df7.toString().trim(),
                        pendingEmail: (decodeURIComponent(df8).split('+').join(' ')).trim(),
                        pendingBusinessAddress: (decodeURIComponent(df9).split('+').join(' ')).trim(),
                        pendingBusinessName: (decodeURIComponent(df10).split('+').join(' ')).trim(),
                        pendingBusinessHours: (decodeURIComponent(df11).split('+').join(' ')).trim(),
                        pendingBusinessType: decodeURIComponent(df12).trim(),
                        pendingAt: firebase.database.ServerValue.TIMESTAMP,
                        pendingImage: downloadURL

                    }).then(function() {
                        $(".overlay").attr("style", "display:none;");
                        alert("Successfully Registered. Please check your email, the admin is currently checking your application. Wait for call or text to confirm.");

                        firebase.auth().signOut().then(function() {

                            userCurrent.delete().then(function() {
                                console.log("User deleted");
                            }).catch(function(error) {
                                console.log(error);
                            });

                        }).catch(function(error) {
                            console.log(error);
                        });

                        window.location.replace("login.html");
                    });

                }).catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    alert("Code::" + errorCode + " Message::" + errorMessage);
                    $(".overlay").attr("style", "display:none;");
                    console.log("Code:" + errorCode + " Message:" + errorMessage);
                });
            });


        }).catch(function(error) {
            console.log(error);
        });
    }
});


//Convert Serialize to JSON
function getFormData($form) {
    var unindexed_array = $form.serialize();
    var vars = [],
        vars2 = [],
        hash;

    var hashes = unindexed_array.split('&');

    for (var i = 0; i < hashes.length; i++) {

        hash = hashes[i].split('=');

        if (hash[0] == "inputBusinessType") {
            vars2.push(hash[1]);
            vars.push(hash[0]);
            vars[hash[0]] = vars2;
        } else {
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
    }
    return vars;
}