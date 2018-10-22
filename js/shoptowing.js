//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

document.addEventListener('DOMContentLoaded', (function() {
    link = new SMSLink.link();
    link.replaceAll();
}), false);


var shopServiceOptions = {
    valueNames: ['iname', 'idesc', { attr: 'data-id', name: 'selectId' }],
    item: '<li class="media list-group-item"><div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4> <span class="label label-warning">Business Owner:  <i class="bowner"></i></span> <br> <span class="label label-primary">Email Address: <i class="be-add"></i></span> <hr style="margin-top: 5px;"> <p class="idesc"></p><hr style="margin: 5px 0;"><button class="btn btn-primary btn-sm pull-right selectId" onclick="modalShowData(this)">More Information</button></div></li>',
    page: 5,
    pagination: true
};

var serviceList = new List('ListServicesItems', shopServiceOptions);

dbRef.child("ShopOverallTowing").on('value', function(snapshot) {

    var stack = [];

    serviceList.clear();

    snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot;
        stack.push(childData);
        console.log(childData);
    });

    for (var i = 0; i <= stack.length - 1; i++) {

        var id = stack[i].key.toString();

        var iname = stack[i].val().towingName;
        var idesc = stack[i].val().towingDesc;

        serviceList.add({
            'iname': iname,
            'idesc': idesc,
            'selectId': id
        });

    };

});

function modalShowData(itemid) {
    var id = $(itemid).data('id');
    $("#showDataModal").modal('show');
    $("#showDataModal").on('shown.bs.modal', function(e) {
        dbRef.child("ShopOverallTowing").child(id).on('value', function(snapshot) {
            var stitles = snapshot.val().towingName;

            $("#serviceName").val(stitles);
            $("#feedbackServiceName").val(stitles);

            dbRef.child("BusinessStores").child(snapshot.key).on('value', function(snapshot) {
                if (snapshot.exists()) {
                    $("#serviceOwner").val(snapshot.val().business_name);
                    $("#serviceAddress").val(snapshot.val().business_address);
                    $("#feedbackServiceOwnerName").val(snapshot.val().business_name);
                    $("#feedbackServiceOwnerId").val(snapshot.key);

                    phoneOrTel(snapshot.val().business_contactNumber);
                }
            });
        });
    });
    $("#feedbackServiceId").val(id);
}

function closeModal() {
    $("#serviceName").val("");
    $("#serviceOwner").val("");
    $("#serviceAddress").val("");
    $("#showDataModal").modal('hide');
}

function phoneOrTel(stringValue) {

    var datalists = $(".itm.cnumber");
    for (var i = datalists.length - 1; i >= 0; i--) {
        datalists[i].remove();
    };


    if (stringValue != "not indicated") {
        var number = stringValue.split(",");
        for (var i = 0; i < number.length; i++) {

            var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + number[i] + '"><div class="input-group-btn"><a href="tel:' + number[i] + '" class="btn btn-primary"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' + number[i] + '" class="btn btn-success"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';

            $("#contact_ul").append(datavalue);
        }
    } else {
        var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + stringValue + '"><div class="input-group-btn"><a href="tel:' + stringValue + '" class="btn btn-primary" disabled="disabled"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' + stringValue + '" class="btn btn-success" disabled="disabled"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';

        $("#contact_ul").append(datavalue);
    }

}

function serviceFeedbackButton() {
    var itemId = $("#feedbackServiceId").val();
    var itemName = $("#feedbackServiceName").val();
    var ownerId = $("#feedbackServiceOwnerId").val();
    var ownerName = $("#feedbackServiceOwnerName").val();
    var feebackMessage = $("#serviceFeedbackTextArea").val();
    var myId = firebase.auth().currentUser.uid;


    dbRef.child("DriversFeedbackItem").child(myId).push().set({
        feedbackItemId: itemId,
        feedbackItemName: itemName,
        feedbackMessage: feebackMessage,
        feedbackItemOwnerId: ownerId,
        feedbackItemOwnerName: ownerName,
        feedbackDatabase: "ShopOverallTowing"

    });

    dbRef.child("OwnersFeedbackItem").child(ownerId).push().set({
        feedbackItemId: itemId,
        feedbackItemName: itemName,
        feedbackMessage: feebackMessage,
        feedbackBy: myId,
        feedbackByName: myName,
        feedbackDatabase: "ShopOverallTowing"
    }).then(function() {
        $("#feedbackServiceId").val("");
        $("#serviceFeedbackTextArea").val("");
        $(".modal").modal('hide');
    });
}