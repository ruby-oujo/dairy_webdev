//Function that loads up the news from the website 
function getNews() {
    const fetchPromise = fetch('Insert news source here', {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => newsFunction(data))
}




//displays the news and parses JSON
function newsFunction(data) {
    var yayNews = JSON.stringify(data)
    var layout = document.getElementById("newslayout")
    var info = "";
    const additems = (item) => {
        info += "<tr><td>" + "<strong>" + item.titleField + "</strong>" + "<br>" +
            "<img src='" + item.enclosureField.urlField + "' width ='40%'" +
            "<br>" + "<br>" + "<em>" + item.pubDateField +
            "</em>" + "<br>" + item.descriptionField + "<br>" +
            '<a href="' + item.linkField + '">' + item.linkField + "</a>" + "<tr></tr>" + "</td></tr>"
    }
    data.forEach(additems);
    layout.innerHTML = info;
}
//function that retrieves the products from site followed by the display table 
function getProducts() {
    const fetchPromise = fetch("http://localhost:8188/DairyService.svc/items", {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((dataP) => productFunction(dataP))
}

function productFunction(dataP) {
    var yayProducts = JSON.stringify(dataP)
    var layoutProduct = document.getElementById("layoutProduct")
    var infoProduct = "";
    const addProducts = (itemProduct) => {
        infoProduct += "<tr><td>" + "<strong>" + itemProduct.Title + "</strong>" + "<br>" +
            "<img src='http://localhost:8188/DairyService.svc/itemimg?id=" + itemProduct.ItemId + "' width ='20%' height= 20%" +
            "<br>" + "<br>" + "<em>" + "$" + itemProduct.Price +
            "</em>" + "<br>" + itemProduct.Type + "<br>" + itemProduct.Origin + "<br>" + "<button onclick='buyButton(" + itemProduct.ItemId + ")'>Buy now!</button>" +
            "</td></tr>"
    }
    dataP.forEach(addProducts);
    layoutProduct.innerHTML = infoProduct;
}



//search bar for products!
function searchBar() {
    var input
    input = document.getElementById("searchbar").value;
    var url = "http://localhost:8188/DairyService.svc/search?term=" + input
    searchItem(url);
}

function searchItem(data) {
    const fetchPromise = fetch(data, {
        headers: {
            "Accept": "application/json",
        },
    });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((dataP) => productFunction(dataP))
}



//Vcard information dissecting 
function stripi(stringi) {
    return stringi.replace(';', ' ');
}

function infoSplit() {
    const fetchPromise = fetch('insert e-card info here');
    const streamPromise = fetchPromise.then((response) => response.text());

    streamPromise.then((data) => {
        var yayCard = data.split("\n")
        pooboo = document.getElementById("info")
        for (i = 0; i < yayCard.length; i++) {
            let vcard = yayCard[i].split(":")

            if (vcard[0].split(";")[0] == "TEL") {
                var tel = vcard[1];
            }
            if (vcard[0].split(";")[0] == "EMAIL") {
                var email = vcard[1];

            }
            if (vcard[0].split(";")[0] == "ADR") {
                var adr = vcard[1];
                adr = stripi(adr);
                adr = adr.split(";");
            }
        }

        var poo = ""
        poo += "<tr><td>" + "<address>" + "&#x1F332;" + adr + "<br>" + "<a href='tel:" + tel + "'>" + tel + "</a>" +
            "<br>" + "<a href='mailto:" + email + "'>" + email + "</a>" + "<br>" +
            "<a href='insert e-card hyperlink here'>" +
            "e-Card" + "</a>" + "</address>" + "</td></tr>"
        pooboo.innerHTML = poo;
    });
}

// change the BUY Function to XHR - ty If you are doing the buy function, then pass the credentials to the buy service. 
//If the customer has not yet logged in, you need to redirect the webpage to the login section.
var loginInfo = {
    username: "",
    password: ""
}

function logInButton() {
    var usernamee = document.getElementById("username1").value
    var passw = document.getElementById("password1").value
    loginInfo = {
        username: usernamee,
        password: passw
    }
    document.getElementById("password1").value = ""
    document.getElementById("username1").value = ""


    var usernameee = loginInfo["username"]
    var passw = loginInfo["password"]
    console.log(usernameee)
    console.log(passw)


    const xhr = new XMLHttpRequest();
    const uri = "http://localhost:8189/Service.svc/user";
    xhr.open("GET", uri, true, usernamee, passw);
    xhr.withCredentials = true;
    xhr.onload = () => {
        //const version_d = document.getElementById("show_result");
        //version_d.innerHTML = xhr.responseText;
        console.log(xhr.responseText)
        var stringg = JSON.stringify(xhr.responseText)
        var success = stringg.includes(usernamee)
        if (success) {
            document.getElementById("logStatus").innerHTML = usernamee + " - Logged in" + "<button onclick=logOutButton()>Logout</button>"
            alert("Log in successful, " + usernamee)
        } else {
            alert("Log in unsuccessful, please try again using a valid username and password.")
        }
    }
    xhr.send(null);


}

function logOutButton() {
    loginInfo = {
        username: "",
        password: ""
    }
    document.getElementById("logStatus").innerHTML = "Logged out" + "<button onclick=logIn()>Login</button>"
}

function buyButton(data) {
    var usernamee = loginInfo["username"]
    var passw = loginInfo["password"]
    console.log(usernamee)

    if (usernamee != "") {
        const xhr = new XMLHttpRequest();
        const uri = 'http://localhost:8189/Service.svc/buy?id=' + data;

        xhr.open("GET", uri, true, usernamee, passw);
        xhr.withCredentials = true;
        xhr.onload = () => {

            document.getElementById("popUp").style.display = "block";
            var info = "" + xhr.responseText + "<button onclick=exit()>&times;</button>"
            var layoutProduct = document.getElementById("popUp")
            layoutProduct.innerHTML = info
                //const version_d = document.getElementById("show_result");
                //version_d.innerHTML = xhr.responseText;
                //alert(xhr.responseText)
        }
        xhr.send(null);

    } else {
        alert("Please login before shopping")
        logIn();
    }



}

function exit() {
    document.getElementById("popUp").style.display = "none";
}



// This is the tab mechanics, done poorly / inefficiently lolol but will improve for next time. 
var touched = true;
const home = () => {
    document.getElementById("home").style.display = "block";
    document.getElementById("map").style.display = "none";
    document.getElementById("reviews").style.display = "none";
    document.getElementById("shopping").style.display = "none";
    document.getElementById("news").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logIn").style.display = "none";



    document.getElementById("homeTab").style.backgroundColor = "white";
    document.getElementById("mapTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("newsTabb").style.backgroundColor = "blanchedalmond";
    document.getElementById("reviewTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("productTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("registerTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("logInTab").style.backgroundColor = "blanchedalmond";



}

const map = () => {
    document.getElementById("map").style.display = "block";
    document.getElementById("home").style.display = "none";
    document.getElementById("reviews").style.display = "none";
    document.getElementById("shopping").style.display = "none";
    document.getElementById("news").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logIn").style.display = "none";



    document.getElementById("mapTab").style.backgroundColor = "white";
    document.getElementById("homeTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("newsTabb").style.backgroundColor = "blanchedalmond";
    document.getElementById("reviewTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("productTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("registerTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("logInTab").style.backgroundColor = "blanchedalmond";


    infoSplit();

}

const shopping = () => {
    document.getElementById("shopping").style.display = "block";
    document.getElementById("home").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("reviews").style.display = "none";
    document.getElementById("news").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logIn").style.display = "none";



    document.getElementById("productTab").style.backgroundColor = "white";
    document.getElementById("mapTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("newsTabb").style.backgroundColor = "blanchedalmond";
    document.getElementById("reviewTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("homeTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("registerTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("logInTab").style.backgroundColor = "blanchedalmond";



    getProducts();

}

const newsTab = () => {
    document.getElementById("news").style.display = "block";
    document.getElementById("home").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("reviews").style.display = "none";
    document.getElementById("shopping").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logIn").style.display = "none";



    document.getElementById("newsTabb").style.backgroundColor = "white";
    document.getElementById("mapTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("homeTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("reviewTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("productTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("registerTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("logInTab").style.backgroundColor = "blanchedalmond";


    getNews();


}

const reviews = () => {
    document.getElementById("reviews").style.display = "block";
    document.getElementById("home").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("shopping").style.display = "none";
    document.getElementById("news").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logIn").style.display = "none";



    document.getElementById("reviewTab").style.backgroundColor = "white";
    document.getElementById("mapTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("newsTabb").style.backgroundColor = "blanchedalmond";
    document.getElementById("homeTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("productTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("registerTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("logInTab").style.backgroundColor = "blanchedalmond";


    window.onload = reviews;

}

const register = () => {
    document.getElementById("register").style.display = "block";
    document.getElementById("home").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("shopping").style.display = "none";
    document.getElementById("news").style.display = "none";
    document.getElementById("reviews").style.display = "none";
    document.getElementById("logIn").style.display = "none";


    document.getElementById("registerTab").style.backgroundColor = "white";
    document.getElementById("mapTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("newsTabb").style.backgroundColor = "blanchedalmond";
    document.getElementById("homeTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("productTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("reviewTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("logInTab").style.backgroundColor = "blanchedalmond";

    window.onload = register;

}

const logIn = () => {
    document.getElementById("logIn").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("home").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("shopping").style.display = "none";
    document.getElementById("news").style.display = "none";
    document.getElementById("reviews").style.display = "none";

    document.getElementById("logInTab").style.backgroundColor = "white";
    document.getElementById("registerTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("mapTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("newsTabb").style.backgroundColor = "blanchedalmond";
    document.getElementById("homeTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("productTab").style.backgroundColor = "blanchedalmond";
    document.getElementById("reviewTab").style.backgroundColor = "blanchedalmond";
    window.onload = logIn;

}

window.onload = home;