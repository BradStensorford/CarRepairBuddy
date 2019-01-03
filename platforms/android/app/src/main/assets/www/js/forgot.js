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


$("#forgotButtonEmail").on('click', function() {

    var emailAddress = $("#forgotInputEmail").val();

    firebase.auth().sendPasswordResetEmail(emailAddress).then(function() {
        
        $("#alertDiv").after(
            '<div class="alert alert-success alert-dismissable">' +
            '<button type="button" class="close" ' +
            'data-dismiss="alert" aria-hidden="true">' +
            '&times;' +
            '</button>' +
            'Password Reset Success' +
            '</div>');

    }).catch(function(error) {

        var errorCode = error.code;
        var errorMessage = error.message;

        $("#alertDiv").after(
            '<div class="alert alert-success alert-dismissable">' +
            '<button type="button" class="close" ' +
            'data-dismiss="alert" aria-hidden="true">' +
            '&times;' +
            '</button>' +
            'Code:' + errorCode + ' message:' + errorMessage + '</div>');
    });
    
});