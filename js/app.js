(function () {
  const STORAGE_LANG_KEY = 'saem_lang';
  const STORAGE_THEME_KEY = 'saem_theme';

  // Each language now lives on its own static, pre-rendered URL so Google can
  // index and show the right snippet language per country (hreflang), instead
  // of one URL whose text is swapped client-side after load.
  const LANG_URLS = { en: '/', tr: '/tr/', ar: '/ar/' };

  const root = document.documentElement;
  const body = document.body;
  const langLinks = document.querySelectorAll('.lang-btn');
  const themeToggleBtn = document.getElementById('themeToggle');
  const menuToggleBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const iconBurger = document.getElementById('iconBurger');
  const iconClose = document.getElementById('iconClose');
  const geoLoader = document.getElementById('geoLoader');

  function applyTheme(theme) {
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  }

  function hideGeoLoader() {
    if (!geoLoader) return;
    geoLoader.classList.add('hide');
    setTimeout(() => geoLoader.remove(), 600);
  }

  function countryToLang(code) {
    if (code === 'SY') return 'ar';
    if (code === 'TR') return 'tr';
    return 'en';
  }

  function fetchWithTimeout(url, ms) {
    return Promise.race([
      fetch(url),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
    ]);
  }

  function goToLang(lang) {
    if (LANG_URLS[lang]) window.location.replace(LANG_URLS[lang]);
  }

  // Geolocation-based redirect only runs on the default (English/root) page.
  // A Turkish or Syrian visitor landing on "/" directly gets sent to their
  // localized page; everyone else simply stays on the English page. Pages
  // reached directly (e.g. from a Google result already showing /tr/ or
  // /ar/) skip this entirely and just remember the visitor's language.
  function initLangRouting() {
    const pageLang = root.getAttribute('lang');

    if (pageLang !== 'en') {
      localStorage.setItem(STORAGE_LANG_KEY, pageLang);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && LANG_URLS[urlLang]) {
      localStorage.setItem(STORAGE_LANG_KEY, urlLang);
      if (urlLang !== 'en') { goToLang(urlLang); return; }
      hideGeoLoader();
      return;
    }

    const storedLang = localStorage.getItem(STORAGE_LANG_KEY);
    if (storedLang) {
      if (storedLang !== 'en' && LANG_URLS[storedLang]) goToLang(storedLang);
      else hideGeoLoader();
      return;
    }

    if (geoLoader) geoLoader.classList.remove('hide');

    fetchWithTimeout('https://ipwho.is/', 4000)
      .then(res => res.json())
      .then(data => {
        const code = data && data.success !== false ? data.country_code : null;
        const lang = countryToLang(code);
        localStorage.setItem(STORAGE_LANG_KEY, lang);
        if (lang !== 'en') { goToLang(lang); return; }
        hideGeoLoader();
      })
      .catch(() => {
        localStorage.setItem(STORAGE_LANG_KEY, 'en');
        hideGeoLoader();
      });
  }

  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();

      const successEl = form.querySelector('.form-success');
      const errorEl = form.querySelector('.form-error');
      const submitBtn = form.querySelector('button[type="submit"]');

      errorEl?.classList.add('hidden');
      successEl?.classList.add('hidden');
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            successEl?.classList.remove('hidden');
            form.reset();
          } else {
            errorEl?.classList.remove('hidden');
          }
        })
        .catch(() => {
          errorEl?.classList.remove('hidden');
        })
        .finally(() => {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'dark';
    applyTheme(savedTheme);
    initLangRouting();

    langLinks.forEach(link => {
      link.addEventListener('click', () => {
        const lang = link.getAttribute('data-lang');
        if (lang) localStorage.setItem(STORAGE_LANG_KEY, lang);
      });
    });

    themeToggleBtn.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });

    function closeMobileNav() {
      mobileNav.classList.remove('open');
      menuToggleBtn.setAttribute('aria-expanded', 'false');
      iconBurger.classList.remove('hidden');
      iconClose.classList.add('hidden');
    }

    menuToggleBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggleBtn.setAttribute('aria-expanded', String(isOpen));
      iconBurger.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
    });

    mobileNav.querySelectorAll('[data-mobile-link]').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeMobileNav();
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    initContactForm();
  });
})();
