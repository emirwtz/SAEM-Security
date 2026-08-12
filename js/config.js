export const PAGE_LANGS = {
  home: { en: '/', tr: '/tr/', ar: '/ar/' },
  privacy: { en: '/privacy.html', tr: '/tr/privacy.html', ar: '/ar/privacy.html' },
  cardvisitEmir: { en: '/cardvisit/emir.html', tr: '/tr/cardvisit/emir.html', ar: '/ar/cardvisit/emir.html' },
  cardvisitShadi: { en: '/cardvisit/shadi.html', tr: '/tr/cardvisit/shadi.html', ar: '/ar/cardvisit/shadi.html' }
};

export const FORM_MESSAGES = {
  en: {
    recaptcha: 'Please complete the reCAPTCHA verification.',
    error: 'Something went wrong while sending, please try again.',
    invalid: 'Please check your input and try again.'
  },
  tr: {
    recaptcha: 'Lütfen reCAPTCHA doğrulamasını tamamlayın.',
    error: 'Gönderilirken bir hata oluştu, lütfen tekrar deneyin.',
    invalid: 'Lütfen girdilerinizi kontrol edip tekrar deneyin.'
  },
  ar: {
    recaptcha: 'يرجى إكمال التحقق من reCAPTCHA.',
    error: 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.',
    invalid: 'يرجى التحقق من المدخلات والمحاولة مرة أخرى.'
  }
};

export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  subject: 200,
  message: 5000
};

export const FORMSPREE_ORIGIN = 'https://formspree.io';

export const RECAPTCHA_SCRIPT = 'https://www.google.com/recaptcha/api.js';

export const THEME_STORAGE_KEY = 'saem_theme';
