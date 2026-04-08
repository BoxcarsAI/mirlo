export function replaceWord(span: HTMLSpanElement, translatedText: string): void {
  span.textContent = translatedText;
  span.classList.add("mirlo-word-translated");
  span.dataset.mirloTranslation = translatedText;
}

export function revertWord(span: HTMLSpanElement): void {
  const original = span.dataset.mirloOriginal;
  if (!original) return;
  span.textContent = original;
  span.classList.remove("mirlo-word-translated");
  delete span.dataset.mirloTranslation;
}

export function replaceWordsInParagraph(
  paragraph: HTMLParagraphElement,
  wordMap: Map<string, string>,
): void {
  const replaced = new Set<string>();
  const wordSpans = paragraph.querySelectorAll<HTMLSpanElement>(".mirlo-word");
  for (const span of wordSpans) {
    const original = span.dataset.mirloOriginal;
    if (original && wordMap.has(original) && !replaced.has(original)) {
      replaceWord(span, wordMap.get(original)!);
      replaced.add(original);
    }
  }
}

export function revertWordsInParagraph(paragraph: HTMLParagraphElement): void {
  const translated = paragraph.querySelectorAll<HTMLSpanElement>(".mirlo-word-translated");
  for (const span of translated) {
    revertWord(span);
  }
}

export interface Translator {
  translate(text: string): Promise<string>;
}

const WORD_PATTERN = /^[a-zA-ZÀ-ÿ]+$/;
const MIN_WORD_LENGTH = 5;
const UPPERCASE_START = /^[A-ZÀ-Ý]/;
const SENTENCE_END = /[.?!]$/;

/**
 * A word is likely a proper noun if it starts with an uppercase letter
 * and is not at the beginning of a sentence (first word in paragraph,
 * or first word after sentence-ending punctuation).
 */
function isLikelyProperNoun(
  span: HTMLSpanElement,
  allSpans: NodeListOf<HTMLSpanElement>,
): boolean {
  const word = span.dataset.mirloOriginal;
  if (!word || !UPPERCASE_START.test(word)) return false;

  // Find this span's index in the list
  let index = -1;
  for (let i = 0; i < allSpans.length; i++) {
    if (allSpans[i] === span) {
      index = i;
      break;
    }
  }

  // First word in paragraph — treat as sentence start
  if (index <= 0) return false;

  // Check if the previous span's original text ends with sentence-ending punctuation
  const prevWord = allSpans[index - 1].dataset.mirloOriginal ?? "";
  if (SENTENCE_END.test(prevWord)) return false;

  return true;
}

const STOPWORDS = new Set([
  // Articles & determiners
  "about", "above", "after", "again", "against", "along", "among",
  "around", "before", "below", "beneath", "beside", "between",
  "beyond", "during", "every", "except", "inside", "other",
  "outside", "since", "their", "there", "these", "those",
  "through", "under", "until", "where", "which", "while",
  "whose", "without", "would", "could", "should", "might",
  "still", "being", "having", "doing", "going", "taken",
  "never", "always", "often", "sometimes", "already", "either",
  "neither", "rather", "quite", "really", "perhaps", "maybe",
  "another", "become", "became", "because", "cannot",
  // Gerunds the Translator API mistranslates as nouns when sent individually
  // e.g. "running"→"funcionamiento", "building"→"edificio"
  // See: docs/decisions/decision-1
  "running", "eating", "thinking", "playing", "writing",
  "building", "learning", "reading", "speaking", "working",
]);

export function collectTranslatableWords(paragraph: HTMLParagraphElement): string[] {
  const spans = paragraph.querySelectorAll<HTMLSpanElement>(".mirlo-word");
  const seen = new Set<string>();
  const words: string[] = [];
  for (const span of spans) {
    const word = span.dataset.mirloOriginal;
    if (!word) continue;
    if (!WORD_PATTERN.test(word)) continue;
    if (word.length < MIN_WORD_LENGTH) continue;
    if (STOPWORDS.has(word.toLowerCase())) continue;
    if (isLikelyProperNoun(span, spans)) continue;
    if (seen.has(word)) continue;
    seen.add(word);
    words.push(word);
  }
  return words;
}

import type { TranslationDensity } from "@/utils/storage-keys";

const DENSITY_RATES: Record<TranslationDensity, number> = {
  low: 0.08,
  medium: 0.25,
  high: 0.5,
};

export function selectWordsForTranslation(
  words: string[],
  density: TranslationDensity,
): string[] {
  if (words.length === 0) return [];
  if (words.length === 1) return [...words];

  const rate = DENSITY_RATES[density] ?? DENSITY_RATES.medium;
  const count = Math.max(1, Math.round(words.length * rate));

  // Fisher-Yates shuffle on a copy, then take first `count`
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export async function buildTranslationMap(
  words: string[],
  translator: Translator,
): Promise<Map<string, string>> {
  const wordMap = new Map<string, string>();
  for (const word of words) {
    try {
      const result = await translator.translate(word);
      const trimmed = result.trim();
      if (trimmed && trimmed.toLowerCase() !== word.toLowerCase()) {
        wordMap.set(word, trimmed);
      }
    } catch {
      // Skip words that fail to translate
    }
  }
  return wordMap;
}
