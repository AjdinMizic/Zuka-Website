var htmlElement = document.documentElement;


/* 1. LANGUAGE BUTTONS */
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

/* 2. DARK / LIGHT THEME BUTTON */
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


/* 3. BIG NAME ANIMATION */
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


/* 4. GALLERY */
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


/* 5. SCROLL PROGRESS LINE + HIGHLIGHTED MENU LINK */
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


(() => {
  const sections = ["work", "about", "contact"];
  const validPaths = ["/", ...sections.map(name => `/${name}`)];

  function getPath() {
    return window.location.pathname.replace(/\/+$/, "") || "/";
  }

  function navigate(path, addHistory = true) {
    if (!validPaths.includes(path)) return;

    if (addHistory && getPath() !== path) {
      history.pushState({}, "", path);
    }

    const sectionName = path.slice(1);

    if (!sectionName) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    document.getElementById(sectionName)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  document.addEventListener("click", event => {
    const link = event.target.closest("a[data-route]");
    if (!link || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    navigate(`/${link.dataset.route}`);
  });

  window.addEventListener("popstate", () => {
    navigate(getPath(), false);
  });

  window.addEventListener("DOMContentLoaded", () => {
    const path = getPath();

    if (validPaths.includes(path) && path !== "/") {
      navigate(path, false);
    }
  });
})();
