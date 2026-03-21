export function replaceWord(span: HTMLSpanElement, translatedText: string): void {
  span.textContent = translatedText;
  span.classList.add("mirlo-word-translated");
  span.title = span.dataset.mirloOriginal || "";
}

export function revertWord(span: HTMLSpanElement): void {
  const original = span.dataset.mirloOriginal;
  if (!original) return;
  span.textContent = original;
  span.classList.remove("mirlo-word-translated");
  span.title = "";
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
