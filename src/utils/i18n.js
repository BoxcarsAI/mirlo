/**
 * Localizes the HTML page by replacing text in elements with data-i18n attributes.
 * This function handles text content and common attributes like placeholder, title, and aria-label.
 */
function localizeHtmlPage() {
  // 0. Set HTML lang attribute
  document.documentElement.lang = chrome.i18n.getUILanguage();
  console.log('Mirlo i18n: UI Language detected as:', chrome.i18n.getUILanguage());

  // 1. Localize text content using data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const messageKey = el.getAttribute('data-i18n');
    const message = chrome.i18n.getMessage(messageKey);
    if (message) {
      el.textContent = message;
    }
  });

  // 2. Localize specific attributes
  const attributeMap = {
    'data-i18n-placeholder': 'placeholder',
    'data-i18n-title': 'title',
    'data-i18n-aria-label': 'aria-label',
    'data-i18n-value': 'value',
    'data-i18n-alt': 'alt'
  };

  Object.entries(attributeMap).forEach(([attr, target]) => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const messageKey = el.getAttribute(attr);
      const message = chrome.i18n.getMessage(messageKey);
      if (message) {
        if (target === 'value' && el.tagName === 'INPUT') {
          el.value = message;
        } else {
          el.setAttribute(target, message);
        }
      }
    });
  });
}

// Auto-run when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', localizeHtmlPage);
} else {
  localizeHtmlPage();
}
