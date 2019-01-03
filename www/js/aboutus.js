// Get a reference to the database service
var database = firebase.database();
var dbRef = database.ref();

// Select all tabs
$('.nav-tabs a').click(function(){
    $(this).tab('show');
});

$("#logoutButton").click(function() {
    firebase.auth().signOut().then(function() {
        window.localStorage.setItem("loginAuthenticate", false);
        window.location.replace("login.html");
    }).catch(function(error) {
        console.log(error);
    });
});

var getUserID = window.localStorage.getItem("loginUserId");

$("#feedbackSystem").submit(function(e) {
    // Prevent form submission
    e.preventDefault();

    // Get the form instance
    var $form = $(e.target);

    var fbd1 = getFormData($form)['feedbackGoal'];
    var fbd2 = getFormData($form)['feedbackReason'];
    var fbd3 = getFormData($form)['feedbackAchievedGoal'];
    var fbd4 = getFormData($form)['feedbackSuggest'];

    dbRef.child("AppFeedback").push().set({
    	feedbackBy: getUserID,
    	feedbackGoal: fbd1,
    	feedbackReason: fbd2,
    	feedbackAchievedGoal: decodeURIComponent(fbd3),
    	feedbackSuggest: decodeURIComponent(fbd4),
        feedbackSent: firebase.database.ServerValue.TIMESTAMP
    }).then(function(){
        $('.bs-feedback-modal').modal('hide');
        alert("Your concern has been sent");
    });
});

$("#cancelFeedback").click(function(e) {
    $('.bs-feedback-modal').modal('hide');
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

$('.bs-feedback-modal').modal('hidden.bs.modal', function(e){
    $('#feedbackGoal').val("");
    $('#feedbackReason').val("");
    $('#feedbackAchievedGoal').val("");
    $('#feedbackSuggest').val("");
});