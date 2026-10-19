/*
  MAIN SCRIPT
  You normally do NOT need to edit this file. Texts, images and links are all in index.html.

  What this file does (in this order):
    1. Language buttons (English / Bosnian)
    2. Dark / light theme button
    3. Big name animation in the hero
    4. Gallery: placeholders for missing images, and the filter buttons
    5. Scroll progress line and highlighted menu link
*/

var htmlElement = document.documentElement;


/* ---------------------------------------------------------------
   1. LANGUAGE BUTTONS
   The texts are written twice in index.html (lang="en" and lang="bs").
   The CSS shows the one that matches the <html lang="..."> value.
--------------------------------------------------------------- */
var languageButtons = document.querySelectorAll('[data-language]');

function setLanguage(language, saveChoice) {
  htmlElement.setAttribute('lang', language);

  languageButtons.forEach(function (button) {
    button.setAttribute('aria-pressed', button.dataset.language === language);
  });

  if (saveChoice) {
    try { localStorage.setItem('language', language); } catch (error) {}
  }
}

languageButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    setLanguage(button.dataset.language, true);
  });
});

setLanguage(htmlElement.getAttribute('lang'), false);

/* ---------------------------------------------------------------
   2. DARK / LIGHT THEME BUTTON
--------------------------------------------------------------- */
var themeButton = document.getElementById('theme-button');

function setTheme(theme, saveChoice) {
  htmlElement.setAttribute('data-theme', theme);
  themeButton.textContent = (theme === 'dark') ? '☀' : '☾';   // sun in dark mode, moon in light mode

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


/* ---------------------------------------------------------------
   3. BIG NAME ANIMATION
   Splits the name in the hero into words so each word can slide in.
--------------------------------------------------------------- */
var heroName = document.getElementById('hero-name');
var nameWords = heroName.textContent.trim().split(' ');

heroName.textContent = '';

nameWords.forEach(function (word, index) {
  var wordWrapper = document.createElement('span');
  var wordInner = document.createElement('span');

  wordWrapper.className = 'word';
  wordInner.textContent = word + ' ';
  wordInner.style.setProperty('--word-index', index);   // used by the CSS to delay each word

  wordWrapper.appendChild(wordInner);
  heroName.appendChild(wordWrapper);
});

document.getElementById('year').textContent = new Date().getFullYear();


/* ---------------------------------------------------------------
   4. GALLERY
--------------------------------------------------------------- */
var galleryItems = document.querySelectorAll('.item');
var filterButtons = document.querySelectorAll('[data-filter]');

// If an image file is missing, show a coloured box with the file name instead.
// This is how you see which file name to use. Real images replace it automatically.
function showPlaceholderIfImageMissing(image, colorNumber) {
  image.addEventListener('error', function () {
    var placeholder = document.createElement('div');
    placeholder.className = 'placeholder';
    placeholder.style.setProperty('--hue', (colorNumber * 47 + 200) % 360);
    placeholder.textContent = image.getAttribute('src');
    image.replaceWith(placeholder);
  });
}

galleryItems.forEach(function (item, index) {
  showPlaceholderIfImageMissing(item.querySelector('img'), index);
});

var portraitImage = document.querySelector('.portrait img');
showPlaceholderIfImageMissing(portraitImage, 3);

// Filter buttons: show only the items whose data-category matches
filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    var chosenCategory = button.dataset.filter;

    filterButtons.forEach(function (otherButton) {
      otherButton.setAttribute('aria-pressed', otherButton === button);
    });

    galleryItems.forEach(function (item) {
      var matches = (chosenCategory === 'all') || (item.dataset.category === chosenCategory);
      item.hidden = !matches;
    });
  });
});


/* ---------------------------------------------------------------
   5. SCROLL PROGRESS LINE + HIGHLIGHTED MENU LINK
--------------------------------------------------------------- */
var progressLine = document.getElementById('scroll-progress');

function updateProgressLine() {
  var scrollableHeight = htmlElement.scrollHeight - window.innerHeight;
  var progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressLine.style.transform = 'scaleX(' + progress + ')';
}

window.addEventListener('scroll', updateProgressLine, { passive: true });
updateProgressLine();

// Highlight the menu link of the section currently in view
var menuLinks = document.querySelectorAll('.menu a');

if ('IntersectionObserver' in window) {
  var sectionWatcher = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        menuLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  document.querySelectorAll('section[id]').forEach(function (section) {
    sectionWatcher.observe(section);
  });
}