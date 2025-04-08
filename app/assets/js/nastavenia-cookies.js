//Init function 
var gaCheckbox = document.getElementById("ga-cookies-0");
var preferencesCheckbox = document.getElementById("preferences-cookies-0");

(function intCookies(){
    gaCheckbox.checked = (window.localStorage.getItem('googleAnalytics') === 'true') ? true : false;   
    preferencesCheckbox.checked = (window.localStorage.getItem('preferences') === 'true') ? true : false;
})();

//Handle save cookie preferencies button
var saveCookieButton = document.getElementsByClassName("save-cookie-settings")[0];
if(saveCookieButton){
    saveCookieButton.onclick = function () { 
        window.localStorage.setItem('googleAnalytics', gaCheckbox.checked);
        window.localStorage.setItem('preferences', preferencesCheckbox.checked);
    location.reload();
    }
}
