(function () {
  var html = document.documentElement;

  // ----- Theme -----
  var theme = null;
  try { theme = localStorage.getItem('theme'); } catch (error) {}

  if (!theme) {
    var deviceIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = deviceIsDark ? 'dark' : 'light';
  }
  html.setAttribute('data-theme', theme);

  // ----- Language -----
  var language = null;
  try { language = localStorage.getItem('language'); } catch (error) {}

  if (!language) {
    var browserLanguage = (navigator.language || 'en').toLowerCase().slice(0, 2);
    var bosnianLike = ['bs', 'hr', 'sr'];
    language = bosnianLike.indexOf(browserLanguage) > -1 ? 'bs' : 'en';
  }
  html.setAttribute('lang', language);
})();
