import { PAGE_LANGS } from './config.js';
import { getCurrentLang } from './i18n.js';

function normalizePath(pathname) {
  if (pathname.endsWith('/index.html')) {
    const base = pathname.slice(0, -10);
    return base || '/';
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function detectPageKey(pathname) {
  const path = normalizePath(pathname);
  if (/\/cardvisit\/emir\.html$/.test(path)) return 'cardvisitEmir';
  if (/\/cardvisit\/shadi\.html$/.test(path)) return 'cardvisitShadi';
  if (/\/privacy\.html$/.test(path)) return 'privacy';
  return 'home';
}

export function initLangSwitcher() {
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
