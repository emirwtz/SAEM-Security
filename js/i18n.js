export function getCurrentLang() {
  const lang = document.documentElement.lang;
  return lang === 'tr' || lang === 'ar' ? lang : 'en';
}
