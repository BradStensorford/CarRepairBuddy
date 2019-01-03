var num = document.getElementById("inputRadius");

var btnEdit = document.getElementById("btnSettingsEdit");
var btnSave = document.getElementById("btnSettingsSave");

btnEdit.addEventListener('click', editFunc);
btnSave.addEventListener('click', saveFunc);

num.value = window.localStorage.getItem("radiusSettings");
console.log(num.value);

function editFunc(){
	if (btnEdit.style.display = "block") {
		btnEdit.style.display = "none";
		btnSave.style.display = "block";

		num.removeAttribute("disabled");

		console.log(num.value);
		num.value = window.localStorage.getItem("radiusSettings");
	}
}

function saveFunc(){
	if (btnSave.style.display = "block") {
		btnSave.style.display = "none";
		btnEdit.style.display = "block";

		var att = document.createAttribute("disabled");
		att.value = "true";
		num.setAttributeNode(att);

		window.localStorage.setItem("radiusSettings", num.value);
		
		$("#alertDiv").after(
            '<div class="alert alert-success alert-dismissable">' +
            '<button type="button" class="close" ' +
            'data-dismiss="alert" aria-hidden="true">' +
            '&times;' +
            '</button>' +
            'Settings Saved.' +
            '</div>');
	}
}