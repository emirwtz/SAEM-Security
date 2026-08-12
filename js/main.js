import { initTheme } from './theme.js';
import { initLangSwitcher } from './lang.js';
import { loadRecaptcha, initContactForm } from './form.js';
import { initMobileNav } from './nav.js';
import { hidePageLoader, initCopyYear } from './loader.js';

initTheme();

window.addEventListener('load', hidePageLoader);

document.addEventListener('DOMContentLoaded', () => {
  initCopyYear();
  initLangSwitcher();
  loadRecaptcha();
  initContactForm();
  initMobileNav();
});
