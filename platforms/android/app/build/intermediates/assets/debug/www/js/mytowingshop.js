//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

var getUserID = window.localStorage.getItem("loginUserId");

function addMyTow() {

    var itemData1 = document.getElementById("addTowName");
    var itemData2 = document.getElementById("addTowDesc");

    if (itemData1.value == "") {
        alert("Fill it up");
    } else {

        dbRef.child("ShopOverallTowing").child(getUserID).set({
            towingName: itemData1.value,
            towingDesc: itemData2.value
        }).then(function() {
            alert("Successfully Added.");
            itemData1.value = "";
            itemData2.value = "";
            $('.modal').modal('hide');
        });
    }
}

var towingOtions = {
    valueNames: ['iname', 'idesc', { attr: 'data-id', name: 'editId' }, { attr: 'data-id', name: 'deleteId' }],
    item: '<div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4><hr><p class="idesc"></p><br><div class="btn-group pull-right" role="group"><button type="button" class="editId btn btn-info" data-target="#editModal" data-toggle="modal" onclick="editTow(this)">Edit</button><button type="button" class="deleteId btn btn-danger" onclick="deleteTow(this)">Delete</button></div></div>'
};
var towList = new List('towingList', towingOtions);

dbRef.child("ShopOverallTowing").child(getUserID).on('value', function(snapshot) {
    towList.clear();

    if (snapshot.exists()) {
        $('#atsss').attr('disabled', 'disabled');

        var iname = snapshot.val().towingName;
        var idesc = snapshot.val().towingDesc;

        towList.add({
            'iname': iname,
            'idesc': idesc,
            'editId': snapshot.key,
            'deleteId': snapshot.key
        });
    } else {
        $('#atsss').removeAttr('disabled');
    }
});


function deleteTow(id) {
    var result_delete = $(id).data('id');
    dbRef.child("ShopOverallTowing").child(result_delete).remove();
}


function editTow(id) {
    var result_edit = $(id).data('id');

    $('#editModal').on('shown.bs.modal', function(e) {

        dbRef.child("ShopOverallTowing").child(result_edit).on('value', function(snapshot) {
            var iename = snapshot.val().towingName;
            var idesc = snapshot.val().towingDesc;

            $(e.currentTarget).find('#editTowName').val(iename);
            $(e.currentTarget).find('#editTowDesc').val(idesc);
        });


        $(e.currentTarget).find('#editServSave').on('click', function() {
            var itemData1 = document.getElementById("editTowName");
            var itemData2 = document.getElementById("editTowDesc");

            if (itemData1.value == "" || itemData2.value == "") {
                alert("Fill it up");

            } else {
                dbRef.child("ShopOverallTowing").child(result_edit).update({
                    towingName: itemData1.value,
                    towingDesc: itemData2.value
                }).then(function() {
                    itemData1.value = "";
                    itemData2.value = "";
                    $('#editModal').modal('hide');
                });
            }
        });
    });
}