// Get a reference to the database service
var database = firebase.database();
var dbRef = database.ref();

var getUserID = window.localStorage.getItem("loginUserId");

var limis = document.getElementById("limis");
var limss = document.getElementById("limss");
var limts = document.getElementById("limts");

dbRef.child("BusinessStores").child(getUserID).on('value', function(snapshot) {
    if (snapshot.exists()) {

        var businesstypes = snapshot.val().business_types;

        if (businesstypes.includes("Parts")) {
            $("#limis").attr("style", "display:block;");

        } 

        if (businesstypes.includes("Services")) {
            $("#limss").attr("style", "display:block;");

        } 

        if (businesstypes.includes("Towing")) {
            $("#limts").attr("style", "display:block;");
        }
    }
});