//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

document.addEventListener('DOMContentLoaded', (function() {
    link = new SMSLink.link();
    link.replaceAll();
}), false);

var getId = window.localStorage.getItem("loginUserId");

var options = {
    valueNames: [
        'iname',
        'iown',
        'imes',
        'itmp'
    ],
    item: '<li class="media list-group-item item dta" style="margin: 5px 10px;"><div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4><hr style="margin: 5px 0;"><label>To: <b class="iown"></b></label><p>Message: <p class="imes"></p></p><p class="itmp"></p></div></li>',
    page: 5,
    pagination: true
};
var userList = new List('ListFeedback', options);

dbRef.child("DriversFeedbackItem").child(getId).on('value', function(snapshot) {

    var stack = [];

    userList.clear();

    snapshot.forEach(function(childSnapshot) {
        stack.push(childSnapshot);
    });

    for (var i = 0; i <= stack.length - 1; i++) {

        var id = stack[i].key.toString();

        var iname = stack[i].val().feedbackItemName;
        var iown = stack[i].val().feedbackItemOwnerName;
        var imes = stack[i].val().feedbackMessage;
        var tmstmp = stack[i].val().feedbackSent;

        var ts = new Date();

        userList.add({
            'iname': iname,
            'iown': iown,
            'imes': imes,
            'itmp': ts.toLocaleString(tmstmp)
        });

    };

});