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
        'itmp',
        { name: 'byId', attr: 'data-id' }
    ],
    item: '<li class="media list-group-item item dta" style="margin: 5px 0;"><div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4><hr style="margin: 5px 0;"><label>from: <b class="iown"></b></label><p>Message: <p class="imes"></p></p><strong>sent at: <p class="itmp"></p></strong><button class="byId btn btn-primary btn-sm pull-right" data-toggle="modal" data-target=".bs-example-modal-sm" onclick="openMess(this)">SEND RESPONSE</button></div></li>',
    page: 5,
    pagination: true
};
var userList = new List('ListFeedback', options);


dbRef.child("OwnersFeedbackItem").child(getId).on('value', function(snapshot) {
    userList.clear();

    snapshot.forEach(function(childSnapshot) {

        var ts = new Date();
        var iname = childSnapshot.val().feedbackItemName;
        var iown = childSnapshot.val().feedbackByName;
        var imes = childSnapshot.val().feedbackMessage;
        var tmstmp = childSnapshot.val().feedbackSent;
        var byId = childSnapshot.val().feedbackBy;

        userList.add({
            'iname': iname,
            'iown': iown,
            'imes': imes,
            'itmp': ts.toLocaleString(tmstmp),
            'byId': byId
        });

    });

});


function openMess(itemid) {
    var id = $(itemid).data('id');

    dbRef.child("Users").child(id).once('value', function(snapshot){
        if (snapshot.exists()) {
            phoneOrTel(snapshot.val().users_conNum);
        }
    });

}


function phoneOrTel(stringValue) {

    var datalists = $(".itm.cnumber");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };


    if (stringValue != "not indicated") {
        var number = stringValue.split(",");
        for (var i = 0; i < number.length; i++) {

            var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + number[i] + '"><div class="input-group-btn"><a href="tel:' + number[i] + '" class="btn btn-primary btn-sm"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' + number[i] + '" class="btn btn-success btn-sm"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';

            $("#contact_ul").append(datavalue);
        }
    } else {
        var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + stringValue + '"><div class="input-group-btn"><a href="tel:' + stringValue + '" class="btn btn-primary" disabled="disabled"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' + stringValue + '" class="btn btn-success" disabled="disabled"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';
        $("#contact_ul").append(datavalue);
    }

}