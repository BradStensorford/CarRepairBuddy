var num = document.getElementById("inputRadius");

var btnEdit = document.getElementById("btnSettingsEdit");
var btnSave = document.getElementById("btnSettingsSave");

btnEdit.addEventListener('click', editFunc);
btnSave.addEventListener('click', saveFunc);

if (getCookie("radius") != "") {
	window.localStorage.setItem("radiusSettings", getCookie("radius"));
}

num.value = window.localStorage.getItem("radiusSettings");
console.log(num.value);

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

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
		setCookie("radius", num.value);
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