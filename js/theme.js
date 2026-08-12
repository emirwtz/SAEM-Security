import { THEME_STORAGE_KEY } from './config.js';

export function initTheme() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === 'light') root.classList.add('light');

  if (!themeToggle) return;

  const syncLabel = () => {
    const isLight = root.classList.contains('light');
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };

  syncLabel();

  themeToggle.addEventListener('click', () => {
    const isLight = root.classList.toggle('light');
    localStorage.setItem(THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
    syncLabel();
  });
}
