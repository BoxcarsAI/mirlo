/**
 * Localizes the HTML page by replacing text in elements with data-i18n attributes.
 * Handles text content and common attributes like placeholder, title, and aria-label.
 */
export function localizeHtmlPage(): void {
  document.documentElement.lang = chrome.i18n.getUILanguage();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const messageKey = el.getAttribute("data-i18n");
    if (!messageKey) return;
    const message = chrome.i18n.getMessage(messageKey);
    if (message) {
      el.textContent = message;
    }
  });

  const attributeMap: Record<string, string> = {
    "data-i18n-placeholder": "placeholder",
    "data-i18n-title": "title",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-value": "value",
    "data-i18n-alt": "alt",
  };

  Object.entries(attributeMap).forEach(([attr, target]) => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const messageKey = el.getAttribute(attr);
      if (!messageKey) return;
      const message = chrome.i18n.getMessage(messageKey);
      if (message) {
        if (target === "value" && el.tagName === "INPUT") {
          (el as HTMLInputElement).value = message;
        } else {
          el.setAttribute(target, message);
        }
      }
    });
  });
}
