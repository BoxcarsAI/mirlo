export function getHtmlLanguage(): string {
  const docLang = document.documentElement?.lang?.trim();
  if (docLang) return docLang;
  const metaLang =
    document.querySelector<HTMLMetaElement>('meta[http-equiv="content-language"]')?.content ||
    document.querySelector<HTMLMetaElement>('meta[name="language"]')?.content;
  return metaLang ? metaLang.trim() : "";
}

export function getNormalizedPageLanguage(): string {
  const htmlLang = getHtmlLanguage();
  if (!htmlLang) return "";
  return htmlLang.split("-")[0].toLowerCase();
}

export interface LanguagePair {
  sourceLanguage: string;
  targetLanguage: string;
}

export function getLanguagePairForPage(
  userNativeLanguage: string,
  userLearningLanguage: string,
): LanguagePair | null {
  const pageLanguage = getNormalizedPageLanguage();
  if (!pageLanguage) return null;
  if (pageLanguage === userNativeLanguage) {
    return { sourceLanguage: userNativeLanguage, targetLanguage: userLearningLanguage };
  }
  if (pageLanguage === userLearningLanguage) {
    return { sourceLanguage: userLearningLanguage, targetLanguage: userNativeLanguage };
  }
  return null;
}
