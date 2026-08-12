export function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  loader.classList.add('hide');
  setTimeout(() => loader.remove(), 600);
}

export function initCopyYear() {
  const copyYearEl = document.getElementById('copyYear');
  if (copyYearEl) copyYearEl.textContent = String(new Date().getFullYear());
}
