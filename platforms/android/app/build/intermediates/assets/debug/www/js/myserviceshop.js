//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

var getUserID = window.localStorage.getItem("loginUserId");

function addMyServ() {

    var itemData1 = document.getElementById("addServName");

    if (itemData1.value == "") {
        alert("Fill it up");
    } else {

        dbRef.child("ShopOverallServices").push().set({
            serviceName: itemData1.value,
            serviceOwner: getUserID
        }).then(function() {
            alert("Successfully Added.");
            itemData1.value = "";
            $('.modal').modal('hide');
        });
    }
}

var serviceOtions = {
    valueNames: ['iname', { attr: 'data-id', name: 'editId' }, { attr: 'data-id', name: 'deleteId' }],
    item: '<li class="media list-group-item item dta"><div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4><hr><div class="btn-group pull-right" role="group"><button type="button" class="editId btn btn-info" data-target="#editModal" data-toggle="modal" onclick="editService(this)">Edit</button><button type="button" class="deleteId btn btn-danger" onclick="deleteService(this)">Delete</button></div></div></li>',
    pages: 5,
    pagination: true
};
var serviceList = new List('ListItems', serviceOtions);

dbRef.child("ShopOverallServices").orderByChild("serviceOwner").equalTo(getUserID).on('value', function(snapshot) {

    var stack = [];

    serviceList.clear();
    
    snapshot.forEach(function(childSnapshot) {
        stack.push(childSnapshot);
    });

    for (var i = 0; i <= stack.length - 1; i++) {

        var id = stack[i].key.toString();

        var iname = stack[i].val().serviceName;

        serviceList.add({
            'iname': iname,
            'editId': id,
            'deleteId': id
        });

    };

});


function deleteService(id) {
    var result_delete = $(id).data('id');
    dbRef.child("ShopOverallServices").child(result_delete).remove();
    alert("Item Removed");
}


function editService(id) {
    var result_edit = $(id).data('id');
    $('#editModal').on('shown.bs.modal', function(e) {

        dbRef.child("ShopOverallServices").child(result_edit).on('value', function(snapshot) {
            var iename = snapshot.val().serviceName;

            $(e.currentTarget).find('#editServName').val(iename);
        });


        $(e.currentTarget).find('#editServSave').on('click', function() {
            var itemData1 = document.getElementById("editServName");
            


            if (itemData1.value == "") {
                alert("Fill it up");

            } else {
                dbRef.child("ShopOverallServices").child(result_edit).update({
                    serviceName: itemData1.value,
                });

                alert("Successfully Edited.");
                itemData1.value = "";
                $('.modal').modal('hide');
            }
        });
    });
}