document.addEventListener('DOMContentLoaded', function () {
  const analyticsCheckbox = document.getElementById('analytics');
  const preferencesCheckbox = document.getElementById('preferences');
  const saveButton = document.getElementById('save-cookie-settings');

  // Google Analytics ID z template.njk
  const GA_MEASUREMENT_ID = 'G-WR6TZ5RBNF';

  // === Helpers ===
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function reloadGAScript() {
    // Vymaž pôvodný GA skript
    const existingScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (existingScript) existingScript.remove();

    // Načítaj GA skript nanovo, ak je povolený
    if (localStorage.getItem('googleAnalytics') === 'true') {
      window['ga-disable-' + GA_MEASUREMENT_ID] = false;

      const gaScript = document.createElement('script');
      gaScript.setAttribute('async', '');
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(gaScript);

      gaScript.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID);
      };
    } else {
      window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    }
  }

  // === Inicializácia ===

  // Inicializácia localStorage
  if (localStorage.getItem('googleAnalytics') === null) {
    localStorage.setItem('googleAnalytics', 'false');
  }

  // Checkboxy z cookies
  if (analyticsCheckbox) {
    analyticsCheckbox.checked = (getCookie('cookie_preferences_analytics') === 'true');
  }

  if (preferencesCheckbox) {
    preferencesCheckbox.checked = (getCookie('cookie_preferences_preferences') === 'true');
  }

  // Nastaviť disable flag pre GA
  window['ga-disable-' + GA_MEASUREMENT_ID] = localStorage.getItem('googleAnalytics') !== 'true';

  // === Event handler na uloženie ===
  if (saveButton) {
    saveButton.addEventListener('click', function () {
      const analyticsAllowed = analyticsCheckbox?.checked || false;
      const preferencesAllowed = preferencesCheckbox?.checked || false;

      // Uloženie do cookies
      setCookie('cookie_preferences_analytics', analyticsAllowed, 365);
      setCookie('cookie_preferences_preferences', preferencesAllowed, 365);
      setCookie('cookie_preferences_necessary', true, 365);

      // Uloženie do localStorage a reštart GA ak treba
      localStorage.setItem('googleAnalytics', analyticsAllowed);
      reloadGAScript();

      // Zobraziť potvrdenie
      const confirmation = document.getElementById('cookie-confirmation');
      if (confirmation) {
        confirmation.classList.remove('hidden');
        setTimeout(() => confirmation.classList.add('hidden'), 5000);
      }
    });
  }
});
