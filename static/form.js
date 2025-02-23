function validacion () {    
    var user = document.getElementById("username").value

    if (user !== "admin") {
        alert("usuario o contraseña incorrecto")
        return false
    }

    sessionStorage.setItem("username", user)

    var pass = document.getElementById("password").value
    if (pass !== "admin") {
        alert("usuario o contraseña incorrecto")
        return false
    };

    sessionStorage.setItem("password", pass)
}
