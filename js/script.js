const PAGE_LANGS = {
  home: { en: '/', tr: '/tr/', ar: '/ar/' },
  privacy: { en: '/privacy.html', tr: '/tr/privacy.html', ar: '/ar/privacy.html' },
  cardvisitEmir: { en: '/cardvisit/emir.html', tr: '/tr/cardvisit/emir.html', ar: '/ar/cardvisit/emir.html' },
  cardvisitShadi: { en: '/cardvisit/shadi.html', tr: '/tr/cardvisit/shadi.html', ar: '/ar/cardvisit/shadi.html' }
};

const FORM_MESSAGES = {
  en: {
    recaptcha: 'Please complete the reCAPTCHA verification.',
    error: 'Something went wrong while sending, please try again.'
  },
  tr: {
    recaptcha: 'Lütfen reCAPTCHA doğrulamasını tamamlayın.',
    error: 'Gönderilirken bir hata oluştu, lütfen tekrar deneyin.'
  },
  ar: {
    recaptcha: 'يرجى إكمال التحقق من reCAPTCHA.',
    error: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.'
  }
};

function getCurrentLang() {
  const lang = document.documentElement.lang;
  return lang === 'tr' || lang === 'ar' ? lang : 'en';
}

function detectPageKey(pathname) {
  if (/\/cardvisit\/emir\.html$/.test(pathname)) return 'cardvisitEmir';
  if (/\/cardvisit\/shadi\.html$/.test(pathname)) return 'cardvisitShadi';
  if (/\/privacy\.html$/.test(pathname)) return 'privacy';
  return 'home';
}

function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('saem_theme');

  if (stored === 'light') root.classList.add('light');

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    localStorage.setItem('saem_theme', isLight ? 'light' : 'dark');
  });
}

function initLangSwitcher() {
  const switcher = document.getElementById('langSwitcher');
  if (!switcher) return;

  const pageKey = detectPageKey(window.location.pathname);
  const routes = PAGE_LANGS[pageKey];
  const currentLang = getCurrentLang();

  switcher.querySelectorAll('[data-lang]').forEach((link) => {
    const lang = link.dataset.lang;
    link.href = routes[lang];
    link.classList.toggle('active', lang === currentLang);
    if (lang === currentLang) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  loader.classList.add('hide');
  setTimeout(() => loader.remove(), 600);
}

function loadRecaptcha() {
  const form = document.getElementById('contactForm');
  if (!form || document.getElementById('recaptchaScript')) return;

  const script = document.createElement('script');
  script.id = 'recaptchaScript';
  script.src = 'https://www.google.com/recaptcha/api.js';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const messages = FORM_MESSAGES[getCurrentLang()];

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const successEl = form.querySelector('.form-success');
    const errorEl = form.querySelector('.form-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    const gotcha = form.querySelector('[name="_gotcha"]');

    if (gotcha && gotcha.value) return;

    errorEl?.classList.add('hidden');
    successEl?.classList.add('hidden');

    if (typeof grecaptcha === 'undefined') {
      if (errorEl) {
        errorEl.textContent = messages.recaptcha;
        errorEl.classList.remove('hidden');
      }
      return;
    }

    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
      if (errorEl) {
        errorEl.textContent = messages.recaptcha;
        errorEl.classList.remove('hidden');
      }
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then((response) => {
        if (response.ok) {
          successEl?.classList.remove('hidden');
          form.reset();
          grecaptcha.reset();
        } else {
          if (errorEl) errorEl.textContent = messages.error;
          errorEl?.classList.remove('hidden');
        }
      })
      .catch(() => {
        if (errorEl) errorEl.textContent = messages.error;
        errorEl?.classList.remove('hidden');
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const iconBurger = document.getElementById('iconBurger');
  const iconClose = document.getElementById('iconClose');

  if (!menuToggle || !mobileNav) return;

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (iconBurger) iconBurger.style.display = 'block';
    if (iconClose) iconClose.style.display = 'none';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    if (iconBurger) iconBurger.style.display = isOpen ? 'none' : 'block';
    if (iconClose) iconClose.style.display = isOpen ? 'block' : 'none';
  });

  document.querySelectorAll('[data-mobile-link]').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

initTheme();

window.addEventListener('load', hidePageLoader);

document.addEventListener('DOMContentLoaded', () => {
  const copyYearEl = document.getElementById('copyYear');
  if (copyYearEl) copyYearEl.textContent = new Date().getFullYear();

  initLangSwitcher();
  loadRecaptcha();
  initContactForm();
  initMobileNav();
});
