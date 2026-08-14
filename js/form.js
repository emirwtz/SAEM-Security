import { FIELD_LIMITS, FORM_MESSAGES, FORMSPREE_ORIGIN, RECAPTCHA_SCRIPT } from './config.js';
import { getCurrentLang } from './i18n.js';

const SUBMIT_TIMEOUT_MS = 15000;

function isAllowedFormAction(action) {
  try {
    const url = new URL(action, window.location.origin);
    return url.origin === FORMSPREE_ORIGIN && /^\/f\/[a-z]+$/.test(url.pathname);
  } catch {
    return false;
  }
}

function validateFormFields(form) {
  const name = form.querySelector('[name="name"]');
  const email = form.querySelector('[name="email"]');
  const subject = form.querySelector('[name="subject"]');
  const message = form.querySelector('[name="message"]');

  if (!name || !email || !message) return false;

  const nameVal = name.value.trim();
  const emailVal = email.value.trim();
  const subjectVal = subject ? subject.value.trim() : '';
  const messageVal = message.value.trim();

  if (!nameVal || nameVal.length > FIELD_LIMITS.name) return false;
  if (!emailVal || emailVal.length > FIELD_LIMITS.email) return false;
  if (subjectVal.length > FIELD_LIMITS.subject) return false;
  if (!messageVal || messageVal.length > FIELD_LIMITS.message) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
}

export function loadRecaptcha() {
  const form = document.getElementById('contactForm');
  if (!form || document.getElementById('recaptchaScript')) return;

  const script = document.createElement('script');
  script.id = 'recaptchaScript';
  script.src = RECAPTCHA_SCRIPT;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

export function initContactForm() {
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

    if (!isAllowedFormAction(form.action)) return;

    errorEl?.classList.add('hidden');
    successEl?.classList.add('hidden');

    if (!validateFormFields(form)) {
      if (errorEl) {
        errorEl.textContent = messages.invalid;
        errorEl.classList.remove('hidden');
      }
      return;
    }

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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: 'application/json' },
      signal: controller.signal
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
        clearTimeout(timeoutId);
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}
