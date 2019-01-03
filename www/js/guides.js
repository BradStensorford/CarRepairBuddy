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

$("#logoutButton").click(function() {
    firebase.auth().signOut().then(function() {
        window.localStorage.setItem("loginAuthenticate", false);
        window.location.replace("login.html");
    }).catch(function(error) {
        console.log(error);
    });
});


$('#mySelect').on('change', function(e) {
	var resultSelected = this.value;
    $.scrollTo(document.getElementById(resultSelected), 800, {offset: {top:-160}});
});

function backtohome(){
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