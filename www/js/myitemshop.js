//FIREBASE REFERENCE FOR DATABASE
var database = firebase.database();
var dbRef = database.ref();

//FIREBASE REFERENCE FOR STORAGE
var storage = firebase.storage();
var storageRef = storage.ref();

//SELECTED IMAGE TO BE UPLOAD
var selectedImage;

var getUserID = window.localStorage.getItem("loginUserId");

//FOR IMAGE UPLOAD PREVIEW
function preview_image(event) {
    selectedImage = event.target.files[0];

    var reader = new FileReader();

    reader.onload = function() {
        var output = document.getElementById('itemImage');
        output.src = reader.result;
    }
    reader.readAsDataURL(selectedImage);
}


function addMyItem() {

    var itemData1 = document.getElementById("addItemName");
    var itemData2 = document.getElementById("addItemDescp");
    var itemData3 = document.getElementById("addItemCode");
    var itemData5 = document.getElementById("addItemCat");
    var itemData4 = document.getElementById("addItemAvail");

    var defaultItem = "https://firebasestorage.googleapis.com/v0/b/carbuddy-1529808959227.appspot.com/o/default_image%2Fdefault_item.png?alt=media&token=05d41c91-318d-452c-bd04-9ca56c5117ce";

    if (selectedImage == null) {

        if (itemData1.value == "" || itemData2.value == "" || itemData3.value == "" || itemData4.value == "" || itemData5.value == "") {
            alert("Fill it up");
        } else {
            dbRef.child("ShopOverallItems").push().set({
                itemName: itemData1.value,
                itemCode: itemData3.value,
                itemAvail: itemData4.value,
                itemDesc: itemData2.value,
                itemImage: defaultItem,
                itemCategory: itemData5.value,
                itemOwner: getUserID
            }).then(function() {
                alert("Successfully Added.");
                itemData1.value = "";
                itemData2.value = "";
                itemData3.value = "";
                $("#addItemCat").selectpicker('val', 'Actuator');
                itemData4.value = "";
                selectedImage = null;
                document.getElementById('itemImage').src = "img/image.png";
                $('.modal').modal('hide');
            });
        }

    } else {

        if (itemData1.value == "" || itemData2.value == "" || itemData3.value == "" || itemData4.value == "" || itemData5.value == "") {
            alert("Fill it up");
        } else {
            //IMAGE FILE NAME TO BE UPLOADED
            var fileName = selectedImage.name;
            //IMAGE STORAGE REFERENCE
            var imageStore = storageRef.child('itemPic/' + Date.now() + "_" + fileName);
            //IMAGE TASK UPLOAD
            var taskUpload = imageStore.put(selectedImage);

            taskUpload.on('state_changed', function(snapshot) {
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function(err) {
                console.log(err);

            }, function() {

                taskUpload.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                    dbRef.child("ShopOverallItems").push().set({
                        itemName: itemData1.value,
                        itemCode: itemData3.value,
                        itemAvail: itemData4.value,
                        itemDesc: itemData2.value,
                        itemImage: downloadURL,
                        itemCategory: itemData5.value,
                        itemOwner: getUserID
                    }).then(function() {
                        alert("Successfully Added.");
                        itemData1.value = "";
                        itemData2.value = "";
                        itemData3.value = "";
                        $("#addItemCat").selectpicker('val', 'Actuator');
                        itemData4.value = "";
                        selectedImage = null;
                        document.getElementById('itemImage').src = "img/image.png";
                        $('.modal').modal('hide');
                    });

                });

            });
        }
    }
}

var itemOtions = {
    valueNames: ['iname','icode','iavail','icat', 'idesc', { attr: 'src', name: 'iimg' }, { attr: 'data-id', name: 'editId' }, { attr: 'data-id', name: 'deleteId' }],
    item: '<li class="media list-group-item item dta"><div class="media-left media-top"><img class="iimg img-circle" width="75px" height="75px"></div><div class="media-body"><h4 class="media-heading"><strong class="iname"></strong></h4><hr><span class="label label-primary">Category: <i class="icat"></i></span><br><span class="label label-success">Availability: <i class="iavail"></i></span><br><span class="label label-info">Item Code:  <i class="icode"></i></span><hr style="margin-top: 5px;"><p style="text-align:justify;" class="idesc"></p><div class="btn-group pull-right" role="group"><button type="button" class="editId btn btn-info" data-target="#editModal" data-toggle="modal" onclick="editItem(this)">Edit</button><button type="button" class="deleteId btn btn-danger" onclick="deleteItem(this)">Delete</button></div></div></li>',
    pages: 5,
    pagination: true
};
var itemList = new List('ListItems', itemOtions);

dbRef.child("ShopOverallItems").orderByChild("itemOwner").equalTo(getUserID).on('value', function(snapshot) {

    var stack = [];

    itemList.clear();

    snapshot.forEach(function(childSnapshot) {
        stack.push(childSnapshot);
    });

    for (var i = 0; i <= stack.length - 1; i++) {

        var iname = stack[i].val().itemName;
        var icode = stack[i].val().itemCode;
        var iavail = stack[i].val().itemAvail;
        var icat = stack[i].val().itemCategory;
        var idesc = stack[i].val().itemDesc;
        var iimg = stack[i].val().itemImage;
        var id = stack[i].key.toString();

        itemList.add({
            'iname': iname,
            'icode': icode,
            'iavail': iavail,
            'icat': icat,
            'idesc': idesc,
            'iimg': iimg,
            'editId': id,
            'deleteId': id
        });
    };

});

function deleteItem(id) {
    var result_delete = $(id).data('id');
    dbRef.child("ShopOverallItems").child(result_delete).remove();
    alert("Item Removed");
}

function editItem(id) {
    var result_edit = $(id).data('id');
    $('#editModal').on('shown.bs.modal', function(e) {

        dbRef.child("ShopOverallItems").child(result_edit).on('value', function(snapshot) {
            var iename = snapshot.val().itemName;
            var iecode = snapshot.val().itemCode;
            var iecat = snapshot.val().itemCategory;
            var ieavail = snapshot.val().itemAvail;
            var iedesc = snapshot.val().itemDesc;
            var ieimg = snapshot.val().itemImage;

            if (ieavail == "On Stock") {
                $(e.currentTarget).find('#editItemAvail').selectpicker('val', 'On Stock');
            } else if (ieavail == "Out of Stock") {
                $(e.currentTarget).find('#editItemAvail').selectpicker('val', 'Out of Stock');
            } else if (ieavail == "limited Stock") {
                $(e.currentTarget).find('#editItemAvail').selectpicker('val', 'limited Stock');
            }

            $(e.currentTarget).find('#itemImageEdit').attr("src", ieimg);
            $(e.currentTarget).find('#editItemName').val(iename);
            $(e.currentTarget).find('#editItemCode').val(iecode);
            $(e.currentTarget).find('#editItemCat').selectpicker('val', iecat);
            $(e.currentTarget).find('#editItemDescp').val(iedesc);
        });

        $(e.currentTarget).find('#editItemSave').on('click', function() {
            var itemData1 = document.getElementById("editItemName");
            var itemData2 = document.getElementById("editItemDescp");
            var itemData3 = document.getElementById("editItemCode");
            var itemData5 = document.getElementById("editItemCat");
            var itemData4 = document.getElementById("editItemAvail");


            if (selectedImage == null) {

                if (itemData1.value == "" || itemData2.value == "" || itemData3.value == "" || itemData4.value == "" || itemData5.value == "") {
                    alert("Fill it up");

                } else {
                    dbRef.child("ShopOverallItems").child(result_edit).update({
                        itemName: itemData1.value,
                        itemCode: itemData3.value,
                        itemAvail: itemData4.value,
                        itemDesc: itemData2.value,
                        itemCategory: itemData5.value
                    }).then(function() {
                        alert("Successfully Edited.");
                        itemData1.value = "";
                        itemData2.value = "";
                        itemData3.value = "";
                        $("#addItemCat").selectpicker('val', 'Actuator');
                        itemData4.value = "";
                        selectedImage = null;
                        document.getElementById('itemImage').src = "img/image.png";
                        $('.modal').modal('hide');
                    });
                }

            } else {
                if (itemData1.value == "" || itemData2.value == "" || itemData3.value == "" || itemData4.value == "" || itemData5.value == "") {
                    alert("Fill it up");

                } else {
                    //IMAGE FILE NAME TO BE UPLOADED
                    var fileName = selectedImage.name;
                    //IMAGE STORAGE REFERENCE
                    var imageStore = storageRef.child('itemPic/' + Date.now() + "_" + fileName);
                    //IMAGE TASK UPLOAD
                    var taskUpload = imageStore.put(selectedImage);

                    taskUpload.on('state_changed', function(snapshot) {
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED: // or 'paused'
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING: // or 'running'
                                console.log('Upload is running');
                                break;
                        }
                    }, function(err) {
                        console.log(err);

                    }, function() {

                        taskUpload.snapshot.ref.getDownloadURL().then(function(downloadURL) {

                            dbRef.child("ShopOverallItems").child(result_edit).update({
                                itemName: itemData1.value,
                                itemCode: itemData3.value,
                                itemAvail: itemData4.value,
                                itemDesc: itemData2.value,
                                itemImage: downloadURL,
                                itemCategory: itemData5.value
                            }).then(function() {
                                alert("Successfully Edited.");
                                itemData1.value = "";
                                itemData2.value = "";
                                itemData3.value = "";
                                $("#addItemCat").selectpicker('val', 'Actuator');
                                itemData4.value = "";
                                selectedImage = null;
                                document.getElementById('itemImage').src = "img/image.png";
                                $('.modal').modal('hide');
                            });
                        });
                    });
                }
            }
        });
    });
}