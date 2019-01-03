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

$("#formUpDataNormal").bootstrapValidator({
    container: '#messages',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        InputProfilePic: {
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
                },
                identical: {
                    field: 'inputPasswordRe',
                    message: 'The password and its confirm are not the same'
                }
            }
        },
        inputPasswordRe: {
            validators: {
                notEmpty: {
                    message: 'Password is required and cannot be empty'
                },
                stringLength: {
                    min: 6,
                    message: 'Password must be minimum of 6 characters'
                },
                identical: {
                    field: 'inputPassword',
                    message: 'The password and its confirm are not the same'
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
        inputHomeAddress: {
            validators: {
                notEmpty: {
                    message: 'Home Address is required and cannot be empty'
                }
            }
        },
        inputContactNumber: {
            validators: {
                notEmpty: {
                    message: 'Contact Number is required and cannot be empty'
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


    var df1 = decodeURI(getFormData($form)["inputFirstname"]);
    var df2 = decodeURI(getFormData($form)["inputMiddlename"]);
    var df3 = decodeURI(getFormData($form)["inputLastname"]);
    var df4 = decodeURI(getFormData($form)["inputPassword"]);
    var df5 = decodeURI(getFormData($form)["inputContactNumber"]);
    var df6 = decodeURIComponent(getFormData($form)["inputEmail"]);
    var df7 = decodeURI(getFormData($form)["inputHomeAddress"]);
    alert(df1 + " " + df2 + " " + df3 + " " + df4 + " " + df5 + " " + df6 + " " + df7);

    if (confirm("Proceed?")) {


        firebase.auth().createUserWithEmailAndPassword(decodeURIComponent(df6), df4.toString().trim()).then(function(user) {

            var userCurrent = firebase.auth().currentUser;
            alert(userCurrent.email);

            userCurrent.sendEmailVerification().then(function() {
                console.log("Success");
            }).catch(function(error) {
                console.log("code:" + error.code + ", message:" + error.message);
            });

            var fileName = selectedImage.name;
            var imageStore = storageRef.child('profilepic/' + Date.now() + "_" + fileName);
            var taskUpload = imageStore.put(selectedImage);
            taskUpload.on('state_changed', function(snapshot) {
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
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
                    dbRef.child("Users").child(userCurrent.uid).set({
                        users_firstName: decodeURI(df1.toString()).trim(),
                        users_middleName: decodeURI(df2.toString()).trim(),
                        users_lastName: decodeURI(df3.toString()).trim(),
                        users_loginPass: decodeURI(df4.toString()).trim(),
                        users_emailAdd: decodeURI(df6.toString()).trim(),
                        users_homeAdd: decodeURI(df7.toString()).trim(),
                        users_conNum: decodeURI(df5.toString()).trim(),
                        users_type: 2,
                        users_imageProfile: downloadURL
                    }).then(function() {
                        var fullname = df1.toString().trim() + " " + df2.toString().charAt(0) + ". " + df3.toString().trim();

                        userCurrent.updateProfile({
                            displayName: fullname,
                            photoURL: downloadURL
                        }).then(function() {
                            console.log('Success');
                        });

                        $(".overlay").attr("style", "display:none;");
                        alert("Successfully Registered.");
                        window.location.replace("login.html");
                    });
                });

            });

        }).catch(function(error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/weak-password') {
                alert('The password is too weak. please enter more than 6 character');
            } else if (errorCode == 'auth/email-already-in-use') {
                alert('Email is already in use.');
            } else if (errorCode == 'auth/invalid-email') {
                alert('Email is invalid.');
            }

            document.getElementById("LoadingOverlay").style.display = "none";
            console.log("Code:" + errorCode + " Message:" + errorMessage);
        });
    }
});


//Convert Serialize to JSON
function getFormData($form) {
    var unindexed_array = $form.serialize();
    var vars = [],
        hash;

    var hashes = unindexed_array.split('&');

    for (var i = 0; i < hashes.length; i++) {

        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];

    }
    return vars;
}