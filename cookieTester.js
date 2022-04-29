/*
 * File: cookieTester.js
 * ---------------------------
 * This program tests how cookies work
 */

// function setCookie(cname,cvalue,exdays) {
//     const d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     let expires = "expires=" + d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }
  
// function getCookie(cname) {
//     let name = cname + "=";
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let ca = decodedCookie.split(';');
//     for(let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//         c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//         return c.substring(name.length, c.length);
//       }
//     }
//     return "";
// }
  
// function checkCookie() {
//     let user = getCookie("username");
//     if (user != "") {
//       alert("Welcome again " + user);
//     } else {
//        user = prompt("Please enter your name:","");
//        if (user != "" && user != null) {
//          setCookie("username", user, 30);
//          console.log("user blank, new set cookie: " + getCookie("username"));
//        }
//     }
// }

function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' '){
            c = c.substring(1,c.length);
        } 
        if (c.indexOf(nameEQ) == 0){
            return c.substring(nameEQ.length,c.length);
        } 
    }
    return "";
}

// setCookie("testCookie","this is a test cookie",30); 
// let exampleCookie = getCookie("testCookie");
// console.log("cookie: " + exampleCookie);

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
      alert("Welcome again " + user);
    } else {
      user = prompt("Please enter your name:", "");
      if (user != "" && user != null) {
        setCookie("username", user, 365);
        alert("new cookie added: " + getCookie("username"));
      }
    }
}

