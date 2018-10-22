var retrievedObject = window.localStorage.getItem('allForOffline');
var objectResult = JSON.parse(retrievedObject);

var options = {
    valueNames: ['business_name', 'business_address', 'business_hours', 'business_types', { attr: 'data-id', name: 'buttonid' }],
    item: '<li class="media list-group-item itm ibn" style="margin: 5px 0;"><div class="media-body"><h4 class="media-heading business_name"></h4><hr style="margin: 5px 0;"><p class="business_address"></p><p class="business_hours"></p><label class="business_types"></label><button class="buttonid btn btn-primary btn-sm pull-right" onclick="openModalId(this)">OPEN</button></div></li>',
    page: 5,
    pagination: true
};

var hackerList = new List('offline-list', options);

for (var i = 0; i < objectResult.length; i++) {
    hackerList.add({
        'business_name': objectResult[i].business_name,
        'business_address': objectResult[i].business_address,
        'business_hours': objectResult[i].business_hours,
        'business_types': objectResult[i].business_types,
        'buttonid': i
    });
}

function openModalId(id) {
    var ids = $(id).data('id');

    $("#profileModal").modal('show');
    $("#profileModal").on('shown.bs.modal', function(e) {
        $("#businessName").val(objectResult[ids].business_name);
        $("#businessAddress").val(objectResult[ids].business_address);
        $("#businessHours").val(objectResult[ids].business_hours);
        $("#businessWebsite").val(objectResult[ids].business_website);
        $("#businessEmail").val(objectResult[ids].business_emailAdd);
        phoneOrTel(objectResult[ids].business_contactNumber);
    });

}

function closeModal() {
    $('#profileModal').modal('hide');
    $("#profileModal").on('hidden.bs.modal', function(e) {
        $("#businessName").val("");
        $("#businessAddress").val("");
        $("#businessHours").val("");
        $("#businessWebsite").val("");
        $("#businessEmail").val("");
        $("#businessContact").val("");
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

            var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + number[i] + '"><div class="input-group-btn"><a href="tel:' + number[i] + '" class="btn btn-primary"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' + number[i] + '" class="btn btn-success"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';

            $("#contact_ul").append(datavalue);
        }
    } else {
        var datavalue = '<div class="input-group itm cnumber"><input type="text" class="form-control input-sm" readonly="readonly" value="' + stringValue + '"><div class="input-group-btn"><a href="tel:' + stringValue + '" class="btn btn-primary" disabled="disabled"><i class="fa fa-phone" aria-hidden="true"></i></a><a href="sms:' +stringValue + '" class="btn btn-success" disabled="disabled"><i class="fa fa-commenting" aria-hidden="true"></i></a></div></div>';
        $("#contact_ul").append(datavalue);
    }

}