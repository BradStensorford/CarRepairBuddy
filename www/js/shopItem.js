//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

document.addEventListener('DOMContentLoaded', (function() {
    link = new SMSLink.link();
    link.replaceAll();
}), false);


var shopItemOptions = {
    valueNames: ['iname', 'icode', 'iavail', 'icat', 'iowner', 'idesc', { attr: 'src', name: 'iimg' }, { attr: 'data-id', name: 'selectId' }],
    item: '<li class="media list-group-item item dta"><div class="media-left media-top"><img class="iimg img-circle" width="75px" height="75px"></div><div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4><hr style="margin:0;"><span class="label label-primary">Category: <i class="icat"></i></span><br><span class="label label-success">Availability: <i class="iavail"></i></span><br><span class="label label-info">Item Code:  <i class="icode"></i></span><br><span class="label label-warning">Contact Person:  <i class="iowner"></i></span> <hr style="margin-top: 5px;"><p style="text-align:justify;" class="idesc"></p><button class="selectId btn btn-primary btn-sm pull-right" onclick="modalShowData(this)">More Information</button></div></li>',
    page: 5,
    pagination: true
};

var shopItemList = new List('ListShopItems', shopItemOptions);

dbRef.child("ShopOverallItems").on('value', function(snapshot) {

    var stack = [];

    shopItemList.clear();

    snapshot.forEach(function(childSnapshot) {
        stack.push(childSnapshot);
    });

    for (var i = 0; i <= stack.length - 1; i++) {

        var id = stack[i].key.toString();

        var iname = stack[i].val().itemName;
        var icode = stack[i].val().itemCode;
        var iavail = stack[i].val().itemAvail;
        var icat = stack[i].val().itemCategory;
        var iown = stack[i].val().itemOwner;
        var idesc = stack[i].val().itemDesc;
        var iimg = stack[i].val().itemImage;
        
        dbRef.child("Users").child(iown).on('value', function(snapshot){
            if (snapshot.val() != null) {
                var user = snapshot.val();
                shopItemList.add({
                    'iname': iname,
                    'icode': icode,
                    'iavail': iavail,
                    'icat': icat,
                    'idesc': idesc,
                    'iowner': user.users_firstName + " " + user.users_middleName + " " + user.users_lastName,
                    'iimg': iimg,
                    'selectId': id
                });
            }
        });
    };

});

function button_filter() {

    var cat = $("#select_filter").val();

    if (cat == "All") {

        dbRef.child("ShopOverallItems").on('value', function(snapshot) {

            var stack = [];

            shopItemList.clear();

            snapshot.forEach(function(childSnapshot) {
                stack.push(childSnapshot);
            });

            for (var i = 0; i <= stack.length - 1; i++) {

                var id = stack[i].key.toString();

                var iname = stack[i].val().itemName;
                var icode = stack[i].val().itemCode;
                var iavail = stack[i].val().itemAvail;
                var icat = stack[i].val().itemCategory;
                var iown = stack[i].val().itemOwner;
                var idesc = stack[i].val().itemDesc;
                var iimg = stack[i].val().itemImage;
        
                dbRef.child("Users").child(iown).on('value', function(snapshot){
                    if (snapshot.val() != null) {
                        var user = snapshot.val();
                        shopItemList.add({
                            'iname': iname,
                            'icode': icode,
                            'iavail': iavail,
                            'icat': icat,
                            'idesc': idesc,
                            'iowner': user.users_firstName + " " + user.users_middleName + " " + user.users_lastName,
                            'iimg': iimg,
                            'selectId': id
                        });
                    }
                });
            };

        });

    } else {
        dbRef.child("ShopOverallItems").orderByChild("itemCategory").equalTo(cat).on('value', function(snapshot) {

            var stack = [];

            shopItemList.clear();

            snapshot.forEach(function(childSnapshot) {
                stack.push(childSnapshot);
            });

            for (var i = 0; i <= stack.length - 1; i++) {

                var id = stack[i].key.toString();

                var iname = stack[i].val().itemName;
                var icode = stack[i].val().itemCode;
                var iavail = stack[i].val().itemAvail;
                var icat = stack[i].val().itemCategory;
                var iown = stack[i].val().itemOwner;
                var idesc = stack[i].val().itemDesc;
                var iimg = stack[i].val().itemImage;
                
                dbRef.child("Users").child(iown).on('value', function(snapshot){
                    if (snapshot.val() != null) {
                        var user = snapshot.val();
                        shopItemList.add({
                            'iname': iname,
                            'icode': icode,
                            'iavail': iavail,
                            'icat': icat,
                            'idesc': idesc,
                            'iowner': user.users_firstName + " " + user.users_middleName + " " + user.users_lastName,
                            'iimg': iimg,
                            'selectId': id
                        });
                    }
                });
            };

        });
    }
}

function modalShowData(itemid) {
    var id = $(itemid).data('id');
    $("#showDataModal").modal('show');
    $("#showDataModal").on('shown.bs.modal', function(e) {
        dbRef.child("ShopOverallItems").child(id).on('value', function(snapshot) {

            if (snapshot.exists()) {
                $("#itemImage").attr('src', snapshot.val().itemImage);
                $("#itemName").val(snapshot.val().itemName);
                $("#itemCode").val(snapshot.val().itemCode);
                $("#itemCategory").val(snapshot.val().itemCategory);
                $("#itemAvailability").val(snapshot.val().itemAvail);
                $("#itemDescription").val(snapshot.val().itemDesc);

                var itemOwner = snapshot.val().itemOwner;
                $("#feedbackServiceName").val(snapshot.val().itemName);

                dbRef.child("BusinessStores").child(itemOwner).on('value', function(snapshot) {
                    if (snapshot.exists()) {
                        $("#itemOwner").val(snapshot.val().business_name);
                        $("#itemAddress").val(snapshot.val().business_address);
                        $("#feedbackServiceOwnerName").val(snapshot.val().business_name);
                        $("#feedbackServiceOwnerId").val(snapshot.key);

                        phoneOrTel(snapshot.val().business_contactNumber);
                    }
                });

            }
        });
    });
    $("#feedbackServiceId").val(id);
}

function closeModal() {
    $("#itemImage").attr('src', 'img/images.png');
    $("#itemName").val("");
    $("#itemCode").val("");
    $("#itemCategory").val("");
    $("#itemAvailability").val("");
    $("#itemDescription").val("");
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

function itemFeedbackButton() {
    var itemId = $("#feedbackServiceId").val();
    var itemName = $("#feedbackServiceName").val();
    var ownerId = $("#feedbackServiceOwnerId").val();
    var ownerName = $("#feedbackServiceOwnerName").val();
    var feebackMessage = $("#serviceFeedbackTextArea").val();
    var myId = firebase.auth().currentUser.uid;
    var myName = window.localStorage.getItem("UsersFullName");

    dbRef.child("DriversFeedbackItem").child(myId).push().set({
        feedbackItemId: itemId,
        feedbackItemName: itemName,
        feedbackMessage: feebackMessage,
        feedbackItemOwnerId: ownerId,
        feedbackItemOwnerName: ownerName,
        feedbackDatabase: "ShopOverallItems",
        feedbackSent: firebase.database.ServerValue.TIMESTAMP
    });

    dbRef.child("OwnersFeedbackItem").child(ownerId).push().set({
        feedbackItemId: itemId,
        feedbackItemName: itemName,
        feedbackMessage: feebackMessage,
        feedbackBy: myId,
        feedbackByName: myName,
        feedbackDatabase: "ShopOverallItems",
        feedbackSent: firebase.database.ServerValue.TIMESTAMP

    }).then(function() {
        $("#feedbackItemId").val("");
        $("#itemFeedbackTextArea").val("");
        $(".modal").modal('hide');
    });
}