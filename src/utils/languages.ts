/**
 * Single source of truth for the languages Mirlo can translate between.
 *
 * The list mirrors the languages supported by Chrome's built-in Translator API
 * (https://developer.chrome.com/docs/ai/translator-api). There is no API to
 * enumerate them yet (tracked in webmachinelearning/translation-api#68), so the
 * list is maintained here. A specific pair is still validated at runtime with
 * `Translator.availability({ sourceLanguage, targetLanguage })`.
 *
 * `flag` is an approximate, decorative country flag — languages are not
 * countries, so it is intentionally NOT used for disambiguation (five of these
 * map to 🇮🇳, and Arabic/English/Chinese flags are contested). The English +
 * native name pair is what makes each option unambiguous.
 */
export interface LanguageInfo {
  code: string;
  english: string;
  native: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "ar", english: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "bg", english: "Bulgarian", native: "Български", flag: "🇧🇬" },
  { code: "bn", english: "Bengali", native: "বাংলা", flag: "🇧🇩" },
  { code: "cs", english: "Czech", native: "Čeština", flag: "🇨🇿" },
  { code: "da", english: "Danish", native: "Dansk", flag: "🇩🇰" },
  { code: "de", english: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "el", english: "Greek", native: "Ελληνικά", flag: "🇬🇷" },
  { code: "en", english: "English", native: "English", flag: "🇬🇧" },
  { code: "es", english: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fi", english: "Finnish", native: "Suomi", flag: "🇫🇮" },
  { code: "fr", english: "French", native: "Français", flag: "🇫🇷" },
  { code: "hi", english: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "hr", english: "Croatian", native: "Hrvatski", flag: "🇭🇷" },
  { code: "hu", english: "Hungarian", native: "Magyar", flag: "🇭🇺" },
  { code: "id", english: "Indonesian", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "it", english: "Italian", native: "Italiano", flag: "🇮🇹" },
  { code: "iw", english: "Hebrew", native: "עברית", flag: "🇮🇱" },
  { code: "ja", english: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "kn", english: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ko", english: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "lt", english: "Lithuanian", native: "Lietuvių", flag: "🇱🇹" },
  { code: "mr", english: "Marathi", native: "मराठी", flag: "🇮🇳" },
  { code: "nl", english: "Dutch", native: "Nederlands", flag: "🇳🇱" },
  { code: "no", english: "Norwegian", native: "Norsk", flag: "🇳🇴" },
  { code: "pl", english: "Polish", native: "Polski", flag: "🇵🇱" },
  { code: "pt", english: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "ro", english: "Romanian", native: "Română", flag: "🇷🇴" },
  { code: "ru", english: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "sk", english: "Slovak", native: "Slovenčina", flag: "🇸🇰" },
  { code: "sl", english: "Slovenian", native: "Slovenščina", flag: "🇸🇮" },
  { code: "sv", english: "Swedish", native: "Svenska", flag: "🇸🇪" },
  { code: "ta", english: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", english: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "th", english: "Thai", native: "ไทย", flag: "🇹🇭" },
  { code: "tr", english: "Turkish", native: "Türkçe", flag: "🇹🇷" },
  { code: "uk", english: "Ukrainian", native: "Українська", flag: "🇺🇦" },
  { code: "vi", english: "Vietnamese", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", english: "Chinese (Simplified)", native: "简体中文", flag: "🇨🇳" },
  { code: "zh-Hant", english: "Chinese (Traditional)", native: "繁體中文", flag: "🇹🇼" },
];

export const SUPPORTED_LANGUAGE_CODES: string[] = SUPPORTED_LANGUAGES.map((l) => l.code);

const BY_CODE = new Map<string, LanguageInfo>(SUPPORTED_LANGUAGES.map((l) => [l.code, l]));

export function isSupportedLanguage(code: string): boolean {
  return BY_CODE.has(code);
}

export function getLanguageInfo(code: string): LanguageInfo | undefined {
  return BY_CODE.get(code);
}

/**
 * Picker/badge label. English name first (so the native <select> typeahead and
 * the alphabetical sort work for the English default UI), native name appended
 * for disambiguation. Languages whose native name equals the English name show
 * a single name. Unknown codes fall back to the uppercased code.
 */
export function getLanguageLabel(code: string): string {
  const info = BY_CODE.get(code);
  if (!info) return code ? code.toUpperCase() : "";
  if (info.native === info.english) return info.english;
  return `${info.english} — ${info.native}`;
}
