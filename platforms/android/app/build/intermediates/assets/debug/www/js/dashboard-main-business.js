// Get a reference to the database service
var database = firebase.database();
var dbRef = database.ref();
var usersCount = 0;
var myItemsCount = 0,
    myServicesCount = 0,
    myFeedbacksCount = 0;

var myUid = window.localStorage.getItem("loginUserId");

dbRef.child("Users").once('value', function(snapshot) {

    var datalists = $(".item.duta");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };

    snapshot.forEach(function(childsnapshot) {
        usersCount++;
    });
}).then(function() {
    var datavalue = '<strong class="item duta">' + usersCount + '</strong>';
    $("#numOfMyUsers").append(datavalue);
});

dbRef.child("OwnersFeedbackItem").child(myUid).once('value', function(snapshot) {

    var datalists = $(".item.dfta");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };

    snapshot.forEach(function(childsnapshot) {
        myFeedbacksCount++;
    });
}).then(function() {
    var datavalue = '<strong class="item dfta">' + myFeedbacksCount + '</strong>';
    $("#numOfMyFeedbacks").append(datavalue);
});

dbRef.child("ShopOverallItems").orderByChild("itemOwner").equalTo(myUid).once('value', function(snapshot) {

    var datalists = $(".item.dita");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };

    snapshot.forEach(function(childsnapshot) {
        myItemsCount++;
    });
}).then(function() {
    var datavalue = '<strong class="item dita">' + myItemsCount + '</strong>';
    $("#numOfMyItem").append(datavalue);
});

dbRef.child("ShopOverallServices").orderByChild("serviceOwner").equalTo(myUid).once('value', function(snapshot) {

    var datalists = $(".item.dsta");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };

    snapshot.forEach(function(childsnapshot) {
        myServicesCount++;
    });
}).then(function() {
    var datavalue = '<strong class="item dsta">' + myServicesCount + '</strong>';
    $("#numOfMyServices").append(datavalue);
});