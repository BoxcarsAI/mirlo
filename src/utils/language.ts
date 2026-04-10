const LANGUAGE_KEYS: Record<string, string> = {
  en: "langEn",
  es: "langEs",
  fr: "langFr",
  de: "langDe",
};

export function getLanguageName(code: string): string {
  const key = LANGUAGE_KEYS[code];
  if (key) {
    return chrome.i18n.getMessage(key);
  }
  return code ? code.toUpperCase() : "";
}

export function getWordCount(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}
