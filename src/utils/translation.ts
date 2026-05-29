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

/**
 * Mirlo translates toward a single target language (the language being
 * learned). Any page that isn't already in the target gets translated into it,
 * using the page's own language as the source. A page already in the target is
 * left alone — there is nothing to learn from it.
 */
export function getLanguagePairForPage(targetLanguage: string): LanguagePair | null {
  const pageLanguage = getNormalizedPageLanguage();
  if (!pageLanguage) return null;
  if (pageLanguage === targetLanguage) return null;
  return { sourceLanguage: pageLanguage, targetLanguage };
}

export interface LanguageDetector {
  detect(text: string): Promise<{ detectedLanguage: string; confidence: number }[]>;
}

const MIN_DETECT_TEXT_LENGTH = 10;
const MIN_DETECT_CONFIDENCE = 0.5;

export async function getLanguagePairForText(
  text: string,
  targetLanguage: string,
  detector: LanguageDetector,
): Promise<LanguagePair | null> {
  if (!text || text.length < MIN_DETECT_TEXT_LENGTH) return null;

  let results: { detectedLanguage: string; confidence: number }[];
  try {
    results = await detector.detect(text);
  } catch {
    return null;
  }

  if (!results || results.length === 0) return null;

  const top = results[0];
  if (top.confidence < MIN_DETECT_CONFIDENCE) return null;

  const detected = top.detectedLanguage;
  if (detected === targetLanguage) return null;
  return { sourceLanguage: detected, targetLanguage };
}
