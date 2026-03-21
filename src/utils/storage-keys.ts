export const STORAGE_KEYS = {
  enabledDomains: "mirlo:enabled_domains",
  dismissedDomains: "mirlo:dismissed_domains",
  nativeLanguage: "mirlo:native_language",
  learningLanguage: "mirlo:learning_language",
  translationDensity: "mirlo:translation_density",
} as const;

export type TranslationDensity = "low" | "medium" | "high";
export const DEFAULT_DENSITY: TranslationDensity = "medium";
