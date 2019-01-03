$("#logoutButton").click(function() {
    firebase.auth().signOut().then(function() {
        window.localStorage.setItem("loginAuthenticate", false);
        window.localStorage.setItem("loginUserId", false);
        window.location.replace("login.html");
    }).catch(function(error) {
        console.log(error);
    });
});