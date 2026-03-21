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
  const wordSpans = paragraph.querySelectorAll<HTMLSpanElement>(".mirlo-word");
  for (const span of wordSpans) {
    const original = span.dataset.mirloOriginal;
    if (original && wordMap.has(original)) {
      replaceWord(span, wordMap.get(original)!);
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
const MIN_WORD_LENGTH = 3;

export function collectTranslatableWords(paragraph: HTMLParagraphElement): string[] {
  const spans = paragraph.querySelectorAll<HTMLSpanElement>(".mirlo-word");
  const seen = new Set<string>();
  const words: string[] = [];
  for (const span of spans) {
    const word = span.dataset.mirloOriginal;
    if (word && WORD_PATTERN.test(word) && word.length >= MIN_WORD_LENGTH && !seen.has(word)) {
      seen.add(word);
      words.push(word);
    }
  }
  return words;
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
