/*
  PROJECT PAGE SCRIPT
  You normally do NOT need to edit this file.

  What it does:
    1. Language buttons (English / Bosnian)
    2. Dark / light theme button
    3. Footer year
    4. Coloured box for missing images
    5. Scroll progress line
*/

var htmlElement = document.documentElement;


/* 1. LANGUAGE BUTTONS */
var languageButtons = document.querySelectorAll('[data-language]');

function setLanguage(language) {
  htmlElement.setAttribute('lang', language);

  languageButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', button.dataset.language === language);
  });

  try { localStorage.setItem('language', language); } catch (error) {}
}

languageButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    setLanguage(button.dataset.language);
  });
});


/* 2. DARK / LIGHT THEME BUTTON */
var themeButton = document.getElementById('theme-button');

function setTheme(theme, saveChoice) {
  htmlElement.setAttribute('data-theme', theme);
  themeButton.textContent = (theme === 'dark') ? '☀' : '☾';

  if (saveChoice) {
    try { localStorage.setItem('theme', theme); } catch (error) {}
  }
}

themeButton.addEventListener('click', function () {
  var currentTheme = htmlElement.getAttribute('data-theme');
  setTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
});

// Show the correct icon on page load
setTheme(htmlElement.getAttribute('data-theme'), false);

// Make the language buttons show the language chosen by early-setup.js
setLanguage(htmlElement.getAttribute('lang'));


/* 3. FOOTER YEAR */
document.getElementById('year').textContent = new Date().getFullYear();


/* 4. MISSING IMAGES
   If an image file is missing, show a coloured box with the file name. */
document.querySelectorAll('.project-images img').forEach(function (image, index) {
  image.addEventListener('error', function () {
    var placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.setProperty('--hue', (index * 47 + 200) % 360);
    placeholder.textContent = image.getAttribute('src');
    image.replaceWith(placeholder);
  });
});


/* 5. SCROLL PROGRESS LINE */
var progressLine = document.getElementById('scroll-progress');

function updateProgressLine() {
  var scrollableHeight = htmlElement.scrollHeight - window.innerHeight;
  var progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressLine.style.transform = 'scaleX(' + progress + ')';
}

window.addEventListener('scroll', updateProgressLine, { passive: true });
updateProgressLine();

/* Keep a real HTML file target for static preview servers, then show its clean URL. */
(function () {
  var cleanPaths = {
    "/project-1.html": "/sinan-sakic-cover",
    "/project-2.html": "/youtube-thumbnails",
    "/project-3.html": "/sports-graphic-design",
    "/project-4.html": "/business-card-design",
    "/project-5.html": "/portrait-photography",
    "/project-6.html": "/apparel-merchandise-design"
  };
  var cleanPath = cleanPaths[window.location.pathname];
  if (cleanPath) {
    window.history.replaceState({}, "", cleanPath);
  }
})();
