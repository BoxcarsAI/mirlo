import "./style.css";
import { normalizeDomain, normalizeDomainList } from "@/utils/domains";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { getLanguageName } from "@/utils/language";
import { isArticleLike } from "@/utils/article-detection";
import { SKIP_SELECTORS, getParagraphText, isEligibleParagraph } from "@/utils/paragraph-filter";
import { getHtmlLanguage, getNormalizedPageLanguage, getLanguagePairForPage, getLanguagePairForText, type LanguageDetector } from "@/utils/translation";
import { segmentParagraph, isSegmented } from "@/utils/word-segmentation";
import {
  replaceWordsInParagraph,
  revertWordsInParagraph,
  collectTranslatableWords,
  buildTranslationMap,
  selectWordsForTranslation,
} from "@/utils/word-replacement";
import { showWordTooltip, scheduleHideWordTooltip, destroyWordTooltip } from "@/utils/word-tooltip";

const TOAST_AUTO_DISMISS_MS = 8000;

let tooltipEl: HTMLDivElement | null = null;
let tooltipPinned = false;
let tooltipHideTimer: ReturnType<typeof setTimeout> | null = null;
let translationStart: number | null = null;
let badgeEl: HTMLButtonElement | null = null;
let activeParagraph: HTMLParagraphElement | null = null;
let translatedParagraph: HTMLParagraphElement | null = null;
let translatingParagraph: HTMLParagraphElement | null = null;
let translationRequestId = 0;
let mirloActive = false;
let listenersBound = false;
let activationToastEl: HTMLDivElement | null = null;
let activationDismissTimer: ReturnType<typeof setTimeout> | null = null;
let modelDownloadToastEl: HTMLDivElement | null = null;
import { type TranslationDensity, DEFAULT_DENSITY } from "@/utils/storage-keys";
let userTranslationDensity: TranslationDensity = DEFAULT_DENSITY;
let userTargetLanguage = "es";
const MARKER_TEXT = "\u00b7";
let cachedDetector: LanguageDetector | null = null;

async function getDetector(): Promise<LanguageDetector | null> {
  if (cachedDetector) return cachedDetector;
  if (!("LanguageDetector" in self)) return null;
  try {
    const availability = await (self as any).LanguageDetector.availability();
    if (availability !== "available" && availability !== "downloadable") return null;
    cachedDetector = await (self as any).LanguageDetector.create();
    return cachedDetector;
  } catch {
    return null;
  }
}

interface LanguageInfo {
  htmlLang: string;
  translationSupported: boolean;
  translationAvailability: string;
  detectorSupported: boolean;
  detectorAvailability: string;
  detectorResult: { detectedLanguage: string; confidence: number } | null;
  detectorError: string | null;
  userActivation: { isActive: boolean; hasBeenActive: boolean };
}

interface StoredDomains {
  enabled: string[];
  dismissed: string[];
}

function shouldSkipNode(node: Node): boolean {
  if (!node || !node.parentElement) return true;
  if (node.parentElement.closest(SKIP_SELECTORS)) return true;
  if (!node.nodeValue || !node.nodeValue.trim()) return true;
  return false;
}

function collectSampleText(limit = 2000): string {
  if (!document.body) return "";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });

  let text = "";
  let current = walker.nextNode();
  while (current && text.length < limit) {
    const value = current.nodeValue?.trim();
    if (value) {
      const next = `${text} ${value}`.trim();
      text = next.slice(0, limit);
    }
    current = walker.nextNode();
  }

  return text;
}

async function getPageLanguageInfo(): Promise<LanguageInfo> {
  const htmlLang = getHtmlLanguage();
  const translationSupported = "Translator" in self;
  const detectorSupported = "LanguageDetector" in self;
  const userActivation = {
    isActive: Boolean((document as any).userActivation?.isActive),
    hasBeenActive: Boolean((document as any).userActivation?.hasBeenActive),
  };

  let detectorAvailability = detectorSupported ? "unknown" : "unsupported";
  let detectorResult: LanguageInfo["detectorResult"] = null;
  let detectorError: string | null = null;

  if (detectorSupported) {
    try {
      detectorAvailability = await (self as any).LanguageDetector.availability();
    } catch (error: any) {
      detectorAvailability = "error";
      detectorError = error?.name || error?.message || "availability-error";
    }
  }

  if (
    detectorSupported &&
    (detectorAvailability === "available" || detectorAvailability === "downloadable")
  ) {
    const sampleText = collectSampleText();
    if (sampleText.length < 20) {
      detectorError = "insufficient-text";
    } else {
      try {
        const detector = await (self as any).LanguageDetector.create();
        const results = await detector.detect(sampleText);
        detectorResult = Array.isArray(results) ? results[0] : null;
      } catch (error: any) {
        detectorError = error?.name || error?.message || "detect-error";
      }
    }
  }

  // Report the real Translator availability for the pair this page would use:
  // detected (or declared) source language → the language being learned.
  let translationAvailability = translationSupported ? "unknown" : "unsupported";
  if (translationSupported) {
    const sourceLanguage = detectorResult?.detectedLanguage || getNormalizedPageLanguage();
    if (!sourceLanguage) {
      translationAvailability = "no-source-language";
    } else if (sourceLanguage === userTargetLanguage) {
      translationAvailability = "already-target";
    } else {
      try {
        translationAvailability = await (self as any).Translator.availability({
          sourceLanguage,
          targetLanguage: userTargetLanguage,
        });
      } catch (error: any) {
        translationAvailability = error?.name || "availability-error";
      }
    }
  }

  return {
    htmlLang,
    translationSupported,
    translationAvailability,
    detectorSupported,
    detectorAvailability,
    detectorResult,
    detectorError,
    userActivation,
  };
}

async function getLanguagePreferences(): Promise<{ target: string; density: TranslationDensity }> {
  return new Promise((resolve) => {
    if (!chrome?.storage?.sync) {
      resolve({ target: "es", density: DEFAULT_DENSITY });
      return;
    }
    chrome.storage.sync.get(
      [STORAGE_KEYS.learningLanguage, STORAGE_KEYS.translationDensity],
      (result) => {
        resolve({
          target: result?.[STORAGE_KEYS.learningLanguage] || "es",
          density: (result?.[STORAGE_KEYS.translationDensity] as TranslationDensity) || DEFAULT_DENSITY,
        });
      },
    );
  });
}

async function initializeLanguageSettings(): Promise<void> {
  const prefs = await getLanguagePreferences();
  userTargetLanguage = prefs.target;
  userTranslationDensity = prefs.density;
}

function getStoredDomains(): Promise<StoredDomains> {
  return new Promise((resolve) => {
    if (!chrome?.storage?.sync) {
      resolve({ enabled: [], dismissed: [] });
      return;
    }
    chrome.storage.sync.get(
      [STORAGE_KEYS.enabledDomains, STORAGE_KEYS.dismissedDomains],
      (result) => {
        if (chrome.runtime?.lastError) {
          resolve({ enabled: [], dismissed: [] });
          return;
        }
        resolve({
          enabled: normalizeDomainList(result?.[STORAGE_KEYS.enabledDomains]),
          dismissed: normalizeDomainList(result?.[STORAGE_KEYS.dismissedDomains]),
        });
      },
    );
  });
}

function setStoredDomains(key: string, domains: string[]): Promise<void> {
  return new Promise((resolve) => {
    if (!chrome?.storage?.sync) {
      resolve();
      return;
    }
    chrome.storage.sync.set({ [key]: domains }, () => resolve());
  });
}

async function addDomainToList(key: string, domain: string): Promise<string[]> {
  const stored = await getStoredDomains();
  const list = key === STORAGE_KEYS.enabledDomains ? stored.enabled : stored.dismissed;
  if (!list.includes(domain)) {
    list.push(domain);
    await setStoredDomains(key, list);
  }
  return list;
}

async function removeDomainFromList(key: string, domain: string): Promise<string[]> {
  const stored = await getStoredDomains();
  const list = key === STORAGE_KEYS.enabledDomains ? stored.enabled : stored.dismissed;
  const next = list.filter((item) => item !== domain);
  if (next.length !== list.length) {
    await setStoredDomains(key, next);
  }
  return next;
}

async function translateWordsInParagraphViaApi(
  paragraph: HTMLParagraphElement,
  translator: any,
): Promise<void> {
  if (!isSegmented(paragraph)) segmentParagraph(paragraph);

  const allWords = collectTranslatableWords(paragraph);
  if (allWords.length === 0) return;

  const words = selectWordsForTranslation(allWords, userTranslationDensity);
  const wordMap = await buildTranslationMap(words, translator);
  if (wordMap.size > 0) {
    replaceWordsInParagraph(paragraph, wordMap);
  }
}

async function getOrCreateTranslator(
  sourceLanguage: string,
  targetLanguage: string,
  cache: Map<string, any>,
): Promise<any | null> {
  const key = `${sourceLanguage}:${targetLanguage}`;
  if (cache.has(key)) return cache.get(key);

  try {
    const availability = await (self as any).Translator.availability({
      sourceLanguage,
      targetLanguage,
    });
    if (availability !== "available" && availability !== "downloadable") return null;
    const translator = await (self as any).Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor(m: any) {
        m.addEventListener("downloadprogress", () => {});
      },
    });
    cache.set(key, translator);
    return translator;
  } catch {
    return null;
  }
}

async function translateWordsOnPage(): Promise<void> {
  if (!("Translator" in self)) return;

  // A not-yet-downloaded model can only be fetched under a user gesture, which
  // the automatic page-load path doesn't have. If the page's pair needs a
  // download, prompt for it instead of silently failing.
  const pending = await getPagePairAvailability();
  if (pending && (pending.availability === "downloadable" || pending.availability === "downloading")) {
    showModelDownloadToast(pending.source);
    return;
  }

  const detector = await getDetector();
  const translatorCache = new Map<string, any>();

  const paragraphs = Array.from(document.querySelectorAll("p")) as HTMLParagraphElement[];
  for (const paragraph of paragraphs) {
    if (!isEligibleParagraph(paragraph)) continue;

    const text = paragraph.innerText?.trim() || "";
    let languagePair = detector
      ? await getLanguagePairForText(text, userTargetLanguage, detector)
      : null;

    // Fall back to page-level detection
    if (!languagePair) {
      languagePair = getLanguagePairForPage(userTargetLanguage);
    }
    if (!languagePair) continue;

    const translator = await getOrCreateTranslator(
      languagePair.sourceLanguage,
      languagePair.targetLanguage,
      translatorCache,
    );
    if (!translator) continue;

    await translateWordsInParagraphViaApi(paragraph, translator);
  }
}

function cancelInFlightTranslation(): void {
  translationRequestId += 1;
  translatingParagraph = null;
}

function appendMarker(paragraph: HTMLParagraphElement): void {
  if (!paragraph) return;
  const existing = paragraph.querySelector(".mirlo-marker");
  if (existing) existing.remove();
  const marker = document.createElement("span");
  marker.className = "mirlo-marker";
  marker.textContent = MARKER_TEXT;
  paragraph.appendChild(marker);
}

function applyTranslatedText(
  paragraph: HTMLParagraphElement,
  translated: string,
  sourceLanguage: string,
  targetLanguage: string,
): void {
  paragraph.dataset.mirloOriginal =
    paragraph.dataset.mirloOriginal || getParagraphText(paragraph);
  paragraph.dataset.mirloTranslated = translated;
  paragraph.dataset.mirloSource = sourceLanguage;
  paragraph.dataset.mirloTarget = targetLanguage;
  paragraph.classList.add("mirlo-translated");
  paragraph.classList.remove("mirlo-reverted");
  paragraph.dataset.mirloState = "translated";
  paragraph.textContent = translated;
  appendMarker(paragraph);
  attachTooltipHandlers(paragraph);
  translatedParagraph = paragraph;
}

function revertParagraph(paragraph: HTMLParagraphElement): void {
  if (!paragraph) return;
  const original = paragraph.dataset.mirloOriginal;
  if (!original) return;
  paragraph.textContent = original;
  paragraph.dataset.mirloState = "original";
  paragraph.classList.add("mirlo-reverted");
  paragraph.classList.remove("mirlo-translated");
  if (translatedParagraph === paragraph) {
    translatedParagraph = null;
  }
}

async function translateParagraph(paragraph: HTMLParagraphElement): Promise<void> {
  if (!paragraph) return;

  // Clear word-level translations before paragraph translation
  revertWordsInParagraph(paragraph);

  const cachedTranslation = paragraph.dataset.mirloTranslated;
  const cachedSource = paragraph.dataset.mirloSource;
  const cachedTarget = paragraph.dataset.mirloTarget;
  if (cachedTranslation && cachedSource && cachedTarget) {
    applyTranslatedText(paragraph, cachedTranslation, cachedSource, cachedTarget);
    return;
  }

  const requestId = (translationRequestId += 1);
  translatingParagraph = paragraph;

  if (!("Translator" in self)) {
    console.log("Translator API missing");
    return;
  }

  const text = getParagraphText(paragraph);
  const detector = await getDetector();
  let languagePair = detector
    ? await getLanguagePairForText(text, userTargetLanguage, detector)
    : null;
  if (!languagePair) {
    languagePair = getLanguagePairForPage(userTargetLanguage);
  }
  if (!languagePair) return;
  const { sourceLanguage, targetLanguage } = languagePair;

  try {
    const availability = await (self as any).Translator.availability({
      sourceLanguage,
      targetLanguage,
    });
    if (requestId !== translationRequestId) return;
    if (availability !== "available" && availability !== "downloadable") {
      console.log("Translator unavailable:", availability);
      return;
    }
  } catch (error) {
    console.log("Translator availability error", error);
    return;
  }

  const originalText = getParagraphText(paragraph);
  if (!originalText) return;

  try {
    const translator = await (self as any).Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor(m: any) {
        m.addEventListener("downloadprogress", (_event: any) => {});
      },
    });
    if (requestId !== translationRequestId) return;
    translationStart = performance.now();
    const translated = await translator.translate(originalText);
    if (requestId !== translationRequestId) return;
    paragraph.dataset.mirloOriginal = originalText;
    applyTranslatedText(paragraph, translated, sourceLanguage, targetLanguage);
  } catch (error) {
    console.log("Translation failed", error);
  }
}

function ensureTooltip(): HTMLDivElement {
  if (tooltipEl) return tooltipEl;
  tooltipEl = document.createElement("div");
  tooltipEl.className = "mirlo-tooltip";
  tooltipEl.innerHTML = `
    <div class="mirlo-tooltip-header">
      <div class="mirlo-tooltip-title"></div>
      <button class="mirlo-tooltip-button" type="button"></button>
    </div>
    <div class="mirlo-tooltip-body"></div>
  `;
  tooltipEl.addEventListener("mouseenter", () => {
    tooltipPinned = true;
  });
  tooltipEl.addEventListener("mouseleave", () => {
    tooltipPinned = false;
    scheduleTooltipHide();
  });
  document.body.appendChild(tooltipEl);
  return tooltipEl;
}

function ensureBadge(): HTMLButtonElement {
  if (badgeEl) return badgeEl;
  const badgeTitle = chrome.i18n.getMessage("contentBadgeTitle");
  badgeEl = document.createElement("button");
  badgeEl.type = "button";
  badgeEl.className = "mirlo-badge";
  badgeEl.title = badgeTitle;
  badgeEl.setAttribute("aria-label", badgeTitle);
  badgeEl.innerHTML = `
    <svg class="mirlo-glyph" viewBox="0 0 1280 923" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0,923) scale(0.1,-0.1)" fill="#1a1a1a" stroke="none">
        <path d="M2000 9220 c-188 -23 -360 -73 -571 -163 l-124 -54 -65 19 c-268 77 -514 119 -707 119 -126 0 -162 -5 -324 -46 -200 -51 -260 -100 -167 -138 31 -13 31 -14 11 -21 -29 -9 -37 -35 -17 -57 9 -10 80 -39 158 -65 170 -56 366 -133 661 -260 326 -140 304 -124 407 -289 49 -77 107 -174 130 -215 23 -41 118 -196 211 -345 196 -315 222 -365 238 -466 15 -94 8 -193 -36 -524 -57 -436 -95 -853 -97 -1084 -1 -108 3 -156 21 -236 101 -445 342 -1112 549 -1520 124 -244 295 -473 590 -788 152 -162 453 -451 597 -574 109 -93 212 -166 310 -222 112 -65 414 -213 560 -276 229 -98 335 -165 335 -210 0 -39 -40 -138 -64 -161 -28 -25 -162 -85 -372 -164 -168 -64 -395 -162 -543 -234 -88 -43 -93 -44 -218 -50 -239 -12 -294 -25 -574 -135 -108 -42 -137 -57 -129 -64 3 -2 95 15 205 39 312 68 489 86 340 35 -148 -50 -435 -213 -435 -247 0 -10 18 -5 68 20 195 98 439 196 488 196 13 0 24 -5 24 -12 0 -12 -112 -125 -244 -246 -37 -35 -66 -66 -63 -69 12 -11 51 12 203 123 145 106 238 160 334 194 32 11 48 8 203 -45 93 -31 171 -54 174 -51 9 8 11 7 -107 76 -110 65 -150 96 -150 115 0 13 103 63 180 89 25 8 110 31 188 51 79 20 203 58 275 84 73 27 245 86 382 131 138 46 257 86 265 90 14 6 153 204 163 232 12 36 18 -21 24 -234 l6 -234 -38 -70 c-21 -38 -56 -95 -77 -126 -45 -68 -612 -639 -657 -662 -16 -9 -106 -32 -198 -51 -186 -38 -269 -63 -358 -106 -62 -30 -160 -97 -153 -105 4 -4 81 18 363 100 66 20 131 36 145 36 22 0 20 -3 -20 -30 -43 -28 -281 -242 -275 -248 1 -1 90 49 198 112 108 63 206 120 219 127 25 14 26 14 -30 -55 -56 -69 -103 -194 -88 -233 6 -14 12 -9 30 23 24 42 144 205 193 262 l28 32 195 -34 c107 -19 197 -33 198 -31 9 9 -106 57 -207 88 l-112 34 153 115 c125 95 200 164 413 379 261 265 476 493 549 582 54 66 66 124 66 336 l0 173 73 -7 c182 -17 273 -43 404 -119 142 -82 279 -100 394 -51 35 15 86 35 112 45 63 23 61 23 612 -101 176 -39 336 -75 355 -79 19 -4 88 -20 152 -34 136 -32 162 -31 166 3 6 37 -49 242 -76 286 -13 22 -45 61 -69 86 l-45 47 118 7 c66 4 351 5 634 2 560 -6 564 -7 750 -68 52 -17 255 -96 451 -175 196 -78 424 -164 505 -189 224 -70 387 -136 619 -253 388 -194 488 -226 709 -226 l149 -1 17 30 c25 45 62 49 216 26 172 -27 185 -27 372 9 287 56 352 84 352 152 0 60 -45 135 -129 217 -59 57 -82 87 -90 117 -18 67 -41 82 -211 142 -846 297 -1225 425 -1668 563 -478 148 -1404 477 -1689 599 -259 111 -712 331 -741 360 -15 14 -67 91 -115 171 -108 177 -188 290 -292 411 -110 128 -872 890 -1020 1019 -293 257 -969 809 -1375 1124 -445 345 -796 640 -981 824 -167 167 -159 155 -493 826 -376 758 -429 848 -605 1018 -229 221 -550 389 -846 442 -106 20 -433 28 -545 15z"/>
      </g>
    </svg>
  `;
  badgeEl.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (activeParagraph) {
      if (translatedParagraph === activeParagraph) {
        cancelInFlightTranslation();
        revertParagraph(activeParagraph);
        return;
      }
      if (translatedParagraph && translatedParagraph !== activeParagraph) {
        revertParagraph(translatedParagraph);
      }
      translateParagraph(activeParagraph);
    }
  });
  return badgeEl;
}

function showBadge(paragraph: HTMLParagraphElement): void {
  if (!paragraph) return;
  const badge = ensureBadge();
  if (badge.parentElement !== paragraph) {
    paragraph.appendChild(badge);
  }
  paragraph.classList.add("mirlo-hoverable");
  badge.classList.add("is-visible");
}

function hideBadge(): void {
  if (!badgeEl) return;
  badgeEl.classList.remove("is-visible");
}

function handleParagraphHover(target: EventTarget | null): void {
  const paragraph = (target as Element)?.closest?.("p") as HTMLParagraphElement | null;
  if (!paragraph || !isEligibleParagraph(paragraph)) {
    activeParagraph = null;
    hideBadge();
    return;
  }

  if (activeParagraph !== paragraph) {
    activeParagraph = paragraph;
    showBadge(paragraph);
  }
}

function positionTooltip(target: Element, tooltip: HTMLElement): void {
  const rect = target.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 8;
  const left = rect.left + window.scrollX;
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.maxWidth = "360px";
}

function showTooltip(paragraph: HTMLParagraphElement): void {
  const tooltip = ensureTooltip();
  const bodyEl = tooltip.querySelector(".mirlo-tooltip-body")!;
  const titleEl = tooltip.querySelector(".mirlo-tooltip-title")!;
  const button = tooltip.querySelector<HTMLButtonElement>(".mirlo-tooltip-button")!;
  const state = paragraph.dataset.mirloState || "translated";
  const original = paragraph.dataset.mirloOriginal || "";
  const translated = paragraph.dataset.mirloTranslated || "";
  const sourceLang = paragraph.dataset.mirloSource || "";
  const targetLang = paragraph.dataset.mirloTarget || userTargetLanguage;

  const nextLangName =
    state === "translated" ? getLanguageName(sourceLang) : getLanguageName(targetLang);

  titleEl.textContent =
    state === "translated" ? getLanguageName(targetLang) : getLanguageName(sourceLang);
  bodyEl.textContent = state === "translated" ? original : translated;
  button.textContent = chrome.i18n.getMessage("contentSwitchTo", [nextLangName]);
  button.onclick = () => toggleParagraphState(paragraph);

  positionTooltip(paragraph, tooltip);
  tooltip.classList.add("is-visible");
}

function hideTooltip(): void {
  if (!tooltipEl) return;
  tooltipEl.classList.remove("is-visible");
}

function scheduleTooltipHide(): void {
  if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
  tooltipHideTimer = setTimeout(() => {
    if (!tooltipPinned) hideTooltip();
  }, 120);
}

function attachTooltipHandlers(paragraph: HTMLParagraphElement): void {
  if (paragraph.dataset.mirloTooltipBound === "true") return;
  paragraph.dataset.mirloTooltipBound = "true";
  paragraph.addEventListener("mouseenter", () => {
    tooltipPinned = false;
    showTooltip(paragraph);
  });
  paragraph.addEventListener("mouseleave", () => {
    scheduleTooltipHide();
  });
}

function toggleParagraphState(paragraph: HTMLParagraphElement): void {
  const state = paragraph.dataset.mirloState || "translated";
  if (state === "translated") {
    paragraph.textContent = paragraph.dataset.mirloOriginal || "";
    paragraph.dataset.mirloState = "original";
    paragraph.classList.add("mirlo-reverted");
    paragraph.classList.remove("mirlo-translated");
    if (translatedParagraph === paragraph) {
      translatedParagraph = null;
    }
  } else {
    if (translatedParagraph && translatedParagraph !== paragraph) {
      revertParagraph(translatedParagraph);
    }
    paragraph.textContent = paragraph.dataset.mirloTranslated || "";
    appendMarker(paragraph);
    paragraph.dataset.mirloState = "translated";
    paragraph.classList.remove("mirlo-reverted");
    paragraph.classList.add("mirlo-translated");
    translatedParagraph = paragraph;
  }
  showTooltip(paragraph);
}

function logAiStatus(): void {
  const hasTranslatorApi = "Translator" in self;
  if (hasTranslatorApi) {
    console.log("Translator API found");
  } else {
    console.log("Translator API missing");
  }
}

function activateMirlo(): void {
  if (mirloActive) return;
  mirloActive = true;
  logAiStatus();
  translateWordsOnPage();
  if (!listenersBound) {
    listenersBound = true;
    document.addEventListener("mouseover", (event) => {
      if (!mirloActive) return;
      const target = event.target as Element;
      if (target?.classList?.contains("mirlo-word-translated")) {
        showWordTooltip(target as HTMLSpanElement);
      }
      handleParagraphHover(event.target);
    });
    document.addEventListener("mouseout", (event) => {
      if (!mirloActive) return;
      const target = event.target as Element;
      if (target?.classList?.contains("mirlo-word-translated")) {
        scheduleHideWordTooltip();
      }
      const related = event.relatedTarget as Node | null;
      if (related && badgeEl && badgeEl.contains(related)) return;
      if (!activeParagraph || !activeParagraph.contains(related)) {
        hideBadge();
      }
    });
  }
}

function deactivateMirlo(): void {
  if (!mirloActive) return;
  mirloActive = false;
  activeParagraph = null;
  cancelInFlightTranslation();
  hideBadge();
  hideTooltip();
  destroyWordTooltip();
}

function removeActivationToast(): void {
  if (!activationToastEl) return;
  activationToastEl.classList.remove("is-visible");
  activationToastEl.classList.add("is-hiding");
  setTimeout(() => {
    activationToastEl?.remove();
    activationToastEl = null;
  }, 200);
}

function showActivationToast(domain: string): void {
  if (activationToastEl || mirloActive) return;
  activationToastEl = document.createElement("div");
  activationToastEl.className = "mirlo-toast";
  activationToastEl.innerHTML = `
    <div class="mirlo-toast-icon">\ud83c\udf10</div>
    <div class="mirlo-toast-content">
      <div class="mirlo-toast-title"></div>
      <div class="mirlo-toast-actions">
        <button class="mirlo-toast-button is-primary" type="button"></button>
        <button class="mirlo-toast-button" type="button"></button>
      </div>
    </div>
  `;

  activationToastEl.querySelector(".mirlo-toast-title")!.textContent =
    chrome.i18n.getMessage("contentEnableOnDomain", [domain]);

  const [enableButton, dismissButton] =
    activationToastEl.querySelectorAll<HTMLButtonElement>(".mirlo-toast-button");

  enableButton.textContent = chrome.i18n.getMessage("contentEnable");
  dismissButton.textContent = chrome.i18n.getMessage("contentNotNow");

  const cleanupTimers = () => {
    if (activationDismissTimer) {
      clearTimeout(activationDismissTimer);
      activationDismissTimer = null;
    }
  };

  const dismissToast = async () => {
    cleanupTimers();
    await addDomainToList(STORAGE_KEYS.dismissedDomains, domain);
    removeActivationToast();
  };

  enableButton?.addEventListener("click", async () => {
    cleanupTimers();
    await addDomainToList(STORAGE_KEYS.enabledDomains, domain);
    await removeDomainFromList(STORAGE_KEYS.dismissedDomains, domain);
    removeActivationToast();
    activateMirlo();
  });

  dismissButton?.addEventListener("click", () => {
    dismissToast();
  });

  document.body.appendChild(activationToastEl);
  requestAnimationFrame(() => {
    activationToastEl?.classList.add("is-visible");
  });

  activationDismissTimer = setTimeout(() => {
    dismissToast();
  }, TOAST_AUTO_DISMISS_MS);
}

/**
 * Determines the source→target pair this page would use and asks Chrome whether
 * its on-device model is ready. Source is the detected page language (falling
 * back to the declared lang). Returns null when there is nothing to translate.
 */
async function getPagePairAvailability(): Promise<{ source: string; availability: string } | null> {
  if (!("Translator" in self)) return null;
  let source = getNormalizedPageLanguage();
  const detector = await getDetector();
  if (detector) {
    const sample = collectSampleText();
    if (sample.length >= 20) {
      try {
        const results = await detector.detect(sample);
        if (results?.[0] && results[0].confidence >= 0.5) {
          source = results[0].detectedLanguage;
        }
      } catch {
        // fall back to declared page language
      }
    }
  }
  if (!source || source === userTargetLanguage) return null;
  try {
    const availability = await (self as any).Translator.availability({
      sourceLanguage: source,
      targetLanguage: userTargetLanguage,
    });
    return { source, availability };
  } catch {
    return null;
  }
}

function removeModelDownloadToast(): void {
  if (!modelDownloadToastEl) return;
  modelDownloadToastEl.classList.remove("is-visible");
  modelDownloadToastEl.classList.add("is-hiding");
  const el = modelDownloadToastEl;
  modelDownloadToastEl = null;
  setTimeout(() => el.remove(), 200);
}

function showModelDownloadToast(source: string): void {
  if (modelDownloadToastEl) return;
  const langName = getLanguageName(userTargetLanguage);
  modelDownloadToastEl = document.createElement("div");
  modelDownloadToastEl.className = "mirlo-toast";
  modelDownloadToastEl.innerHTML = `
    <div class="mirlo-toast-icon">⬇️</div>
    <div class="mirlo-toast-content">
      <div class="mirlo-toast-title"></div>
      <div class="mirlo-toast-actions">
        <button class="mirlo-toast-button is-primary" type="button"></button>
        <button class="mirlo-toast-button" type="button"></button>
      </div>
    </div>
  `;

  const titleEl = modelDownloadToastEl.querySelector(".mirlo-toast-title")!;
  titleEl.textContent = chrome.i18n.getMessage("contentDownloadModelTitle", [langName]);

  const [downloadButton, dismissButton] =
    modelDownloadToastEl.querySelectorAll<HTMLButtonElement>(".mirlo-toast-button");
  downloadButton.textContent = chrome.i18n.getMessage("contentDownloadModel");
  dismissButton.textContent = chrome.i18n.getMessage("contentNotNow");

  // The click provides the transient user activation Chrome needs to download.
  downloadButton.addEventListener("click", async () => {
    downloadButton.disabled = true;
    try {
      await (self as any).Translator.create({
        sourceLanguage: source,
        targetLanguage: userTargetLanguage,
        monitor(m: any) {
          m.addEventListener("downloadprogress", (event: any) => {
            const pct = Math.round((event?.loaded ?? 0) * 100);
            downloadButton.textContent = chrome.i18n.getMessage("contentDownloading", [`${pct}%`]);
          });
        },
      });
      removeModelDownloadToast();
      translateWordsOnPage();
    } catch {
      downloadButton.disabled = false;
      downloadButton.textContent = chrome.i18n.getMessage("contentDownloadFailed");
    }
  });

  dismissButton.addEventListener("click", () => removeModelDownloadToast());

  document.body.appendChild(modelDownloadToastEl);
  requestAnimationFrame(() => modelDownloadToastEl?.classList.add("is-visible"));
}

async function handleActivationFlow(): Promise<void> {
  await initializeLanguageSettings();
  const domain = normalizeDomain(location.hostname);
  if (!domain) return;
  const stored = await getStoredDomains();
  if (stored.enabled.includes(domain)) {
    const pageLanguage = getNormalizedPageLanguage();
    if (pageLanguage && pageLanguage === userTargetLanguage) {
      console.log(`Page already in target language (${pageLanguage}); nothing to translate`);
      return;
    }
    activateMirlo();
    return;
  }
  if (stored.dismissed.includes(domain)) return;
  if (!isArticleLike()) return;
  const pageLanguage = getNormalizedPageLanguage();
  // Only prompt when we can see the page is in some other language than the target.
  if (!pageLanguage || pageLanguage === userTargetLanguage) {
    return;
  }
  showActivationToast(domain);
}

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_idle",
  main() {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", handleActivationFlow, { once: true });
    } else {
      handleActivationFlow();
    }

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message?.type === "mirlo:getLanguageInfo") {
        getPageLanguageInfo()
          .then(sendResponse)
          .catch((error) => {
            sendResponse({
              error: error?.name || error?.message || "unknown-error",
            });
          });
        return true;
      }
      if (message?.type === "mirlo:setActive") {
        if (message?.enabled) {
          removeActivationToast();
          initializeLanguageSettings().then(() => {
            activateMirlo();
            sendResponse({ active: mirloActive });
          });
          return true;
        }
        deactivateMirlo();
        sendResponse({ active: mirloActive });
        return;
      }
    });
  },
});
