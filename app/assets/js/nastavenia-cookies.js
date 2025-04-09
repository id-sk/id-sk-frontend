//Init function 
var gaCheckbox = document.getElementById("ga-cookies");
var preferencesCheckbox = document.getElementById("preferences-cookies");

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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // Načítať existujúce hodnoty cookies a nastaviť checkboxy
  document.addEventListener('DOMContentLoaded', function () {
    const analyticsCheckbox = document.getElementById('analytics');
    const preferencesCheckbox = document.getElementById('preferences');
  
    if (getCookie('cookie_preferences_analytics') === 'true') {
      analyticsCheckbox.checked = true;
    }
    if (getCookie('cookie_preferences_preferences') === 'true') {
      preferencesCheckbox.checked = true;
    }
  });
  