$(document).ready(function() {
    $("#sidebar").mCustomScrollbar({
        theme: "minimal"
    });

    $('#dismiss, .overlay').on('click', function() {
        $('#sidebar').removeClass('active');
        $('.overlay').fadeOut();
    });

    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').addClass('active');
        $('.overlay').fadeIn();
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});

setInterval(function(){
    if (navigator.onLine) {
        $(".navbar").css("background", "#3F51B5");
        $(".navbar-map").css("background", "#3F51B5");
    }
    else {
        $(".navbar").css("background", "#8C43F5");
        $(".navbar-map").css("background", "#8C43F5");
    }
}, 1000);

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

var getId = window.localStorage.getItem("loginUserId");

//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();
if (getId !== "false") {
    dbRef.child("Users").child(getId).on('value', function(snapshot) {
        var imgSrc = document.getElementById("userImage");
        imgSrc.src = snapshot.val().users_imageProfile;
    
        var fullName = snapshot.val().users_firstName + " " + (snapshot.val().users_middleName).charAt(0) + ". " + snapshot.val().users_lastName;
        var nameData = document.getElementById("userFullName");
        var nameNode = document.createTextNode(fullName);
        nameData.appendChild(nameNode);
        window.localStorage.setItem("UsersFullName", fullName);
    
        var emailData = document.getElementById("userEmailAdd");
        var emailNode = document.createTextNode(snapshot.val().users_emailAdd);
        emailData.appendChild(emailNode);
    });
}
else {
    window.location.replace("login.html");
}
