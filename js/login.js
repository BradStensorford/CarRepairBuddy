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

// Get a reference to the database service
var database = firebase.database();
var dbRef = database.ref();

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    var userResult = window.localStorage.getItem("loginAuthenticate");
    var userType = window.localStorage.getItem("typeStr");

    if (userResult == "true") {
        if (userType == "1") {
            window.location.replace("dashboard-main-business.html");
        } else if (userType == "2") {
            window.location.replace("index-normal.html");
        }

    } else {
        console.log("No Signed in User.");
    }
}

//Login Button
$("#inputButton").on('click', function() {
    var $btn = $(this).button('loading');

    var loginName = $("#inputEmail").val();
    var loginPass = $("#inputPassword").val();

    if (loginName == "" || loginName == null && loginPass == "" || loginPass == null) {
        $("#alertLogin").after(
            '<div class="alert alert-danger alert-dismissable">' +
            '<button type="button" class="close" ' +
            'data-dismiss="alert" aria-hidden="true">' +
            '&times;' +
            '</button>' +
            'Please complete the authentication' +
            '</div>');

    } else {

        firebase.auth().signInWithEmailAndPassword(loginName, loginPass).then(function(user) {

            var user = firebase.auth().currentUser;
            var name, email, uid, emailVerified;

            if (user != null) {
                name = user.displayName;
                email = user.email;
                emailVerified = user.emailVerified;
                uid = user.uid;
            }

            dbRef.child("Users").child(uid).once('value', function(snapshot) {
                if (snapshot.exists()) {

                    if (emailVerified == false) {
                        $("#alertLogin").after(
                            '<div class="alert alert-danger alert-dismissable">' +
                            '<button type="button" class="close" ' +
                            'data-dismiss="alert" aria-hidden="true">' +
                            '&times;' +
                            '</button>' +
                            'Please verify your account tru your email.' +
                            '</div>');
                        alert(user.email);
                        user.sendEmailVerification().then(function() {
                            $("#alertLogin").after(
                                '<div class="alert alert-warning alert-dismissable">' +
                                '<button type="button" class="close" ' +
                                'data-dismiss="alert" aria-hidden="true">' +
                                '&times;' +
                                '</button>' +
                                'We sent a verification address to your email.' +
                                '</div>');

                        }).catch(function(error) {
                            var errorCode = error.code;
                            var errorMessage = error.message;

                            $("#alertLogin").after(
                                '<div class="alert alert-warning alert-dismissable">' +
                                '<button type="button" class="close" ' +
                                'data-dismiss="alert" aria-hidden="true">' +
                                '&times;' +
                                '</button>' +
                                'Code::' + errorCode + ' Message::' + errorMessage + '</div>');

                        });


                        firebase.auth().signOut();

                    } else {

                        var utype = snapshot.val().users_type;
                        window.localStorage.setItem("typeStr", utype);
                        window.localStorage.setItem("loginAuthenticate", "true");
                        window.localStorage.setItem("loginUserId", uid);
                        window.localStorage.setItem("radiusSettings", "1");

                        if (utype == 1) {
                            window.location.replace("dashboard-main-business.html");
                        } else if (utype == 2) {
                            window.location.replace("index-normal.html");
                        }


                    }

                } else {
                    $("#alertLogin").after(
                        '<div class="alert alert-danger alert-dismissable">' +
                        '<button type="button" class="close" ' +
                        'data-dismiss="alert" aria-hidden="true">' +
                        '&times;' +
                        '</button>' +
                        'An external error has occured, please contact the Administrator' +
                        '</div>');
                }
            });

        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                $("#alertLogin").after(
                    '<div class="alert alert-danger alert-dismissable">' +
                    '<button type="button" class="close" ' +
                    'data-dismiss="alert" aria-hidden="true">' +
                    '&times;' +
                    '</button>' +
                    'Wrong Password' +
                    '</div>');

            } else if (errorCode === 'auth/user-not-found') {
                $("#alertLogin").after(
                    '<div class="alert alert-danger alert-dismissable">' +
                    '<button type="button" class="close" ' +
                    'data-dismiss="alert" aria-hidden="true">' +
                    '&times;' +
                    '</button>' +
                    'User not found' +
                    '</div>');

            } else if (errorCode === 'auth/user-disabled') {
                $("#alertLogin").after(
                    '<div class="alert alert-danger alert-dismissable">' +
                    '<button type="button" class="close" ' +
                    'data-dismiss="alert" aria-hidden="true">' +
                    '&times;' +
                    '</button>' +
                    'User is disabled by the admin' +
                    '</div>');

            } else if (errorCode === 'auth/invalid-email') {
                $("#alertLogin").after(
                    '<div class="alert alert-danger alert-dismissable">' +
                    '<button type="button" class="close" ' +
                    'data-dismiss="alert" aria-hidden="true">' +
                    '&times;' +
                    '</button>' +
                    'Invalid Email' +
                    '</div>');

            } else {
                $("#alertLogin").after(
                    '<div class="alert alert-danger alert-dismissable">' +
                    '<button type="button" class="close" ' +
                    'data-dismiss="alert" aria-hidden="true">' +
                    '&times;' +
                    '</button>' +
                    'Code:' + errorCode + ' message:' + errorMessage + '</div>');
            }
            console.log(error);
        });
    }

    $btn.button('reset');
});