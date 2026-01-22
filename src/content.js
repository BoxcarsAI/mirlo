(() => {
  const TARGET_WORD = "the";
  const MAX_HIGHLIGHTS = 5;
  const HIGHLIGHT_CLASS = "peli-can-highlight";
  const SKIP_SELECTORS =
    "script,style,textarea,code,pre,svg,math,head,title,input,option,select,button";
  const TRANSLATE_TARGET_LANGUAGE = "es";

  let highlights = 0;
  let scheduled = false;
  let translationAttempted = false;
  let tooltipEl = null;
  let tooltipPinned = false;
  let tooltipHideTimer = null;

  function getHtmlLanguage() {
    const docLang = document.documentElement?.lang?.trim();
    if (docLang) return docLang;
    const metaLang =
      document.querySelector('meta[http-equiv="content-language"]')?.content ||
      document.querySelector('meta[name="language"]')?.content;
    return metaLang ? metaLang.trim() : "";
  }

  function collectSampleText(limit = 2000) {
    if (!document.body) return "";
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return shouldSkipNode(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

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

  async function getPageLanguageInfo() {
    const htmlLang = getHtmlLanguage();
    const translationSupported = typeof window.translation !== "undefined";
    const detectorSupported = "LanguageDetector" in self;
    const userActivation = {
      isActive: Boolean(document.userActivation?.isActive),
      hasBeenActive: Boolean(document.userActivation?.hasBeenActive)
    };

    let detectorAvailability = detectorSupported ? "unknown" : "unsupported";
    let detectorResult = null;
    let detectorError = null;

    if (detectorSupported) {
      try {
        detectorAvailability = await self.LanguageDetector.availability();
      } catch (error) {
        detectorAvailability = "error";
        detectorError = error?.name || error?.message || "availability-error";
      }
    }

    if (
      detectorSupported &&
      (detectorAvailability === "available" ||
        detectorAvailability === "downloadable")
    ) {
      const sampleText = collectSampleText();
      if (sampleText.length < 20) {
        detectorError = "insufficient-text";
      } else {
        try {
          const detector = await self.LanguageDetector.create();
          const results = await detector.detect(sampleText);
          detectorResult = Array.isArray(results) ? results[0] : null;
        } catch (error) {
          detectorError = error?.name || error?.message || "detect-error";
        }
      }
    }

    return {
      htmlLang,
      translationSupported,
      detectorSupported,
      detectorAvailability,
      detectorResult,
      detectorError,
      userActivation
    };
  }

  function getSourceLanguage() {
    const htmlLang = getHtmlLanguage();
    if (!htmlLang) return "en";
    return htmlLang.split("-")[0].toLowerCase();
  }

  function getWordCount(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  function isVisibleElement(element) {
    if (!element) return false;
    if (element.closest("nav,header,footer,aside")) return false;
    const rect = element.getBoundingClientRect();
    if (!rect || rect.width < 20 || rect.height < 16) return false;
    return true;
  }

  function findParagraphToTranslate() {
    const paragraphs = Array.from(document.querySelectorAll("p"));
    for (const paragraph of paragraphs) {
      if (!isVisibleElement(paragraph)) continue;
      const text = paragraph.innerText?.trim();
      if (!text) continue;
      if (getWordCount(text) <= 15) continue;
      if (paragraph.classList.contains("mirlo-translated")) continue;
      return paragraph;
    }
    return null;
  }

  async function translateParagraph(paragraph) {
    if (!paragraph || translationAttempted) return;
    translationAttempted = true;

    if (!("Translator" in self)) {
      console.log("Translator API missing");
      return;
    }

    const sourceLanguage = getSourceLanguage();
    const targetLanguage = TRANSLATE_TARGET_LANGUAGE;

    try {
      const availability = await self.Translator.availability({
        sourceLanguage,
        targetLanguage
      });
      if (availability !== "available" && availability !== "downloadable") {
        console.log("Translator unavailable:", availability);
        return;
      }
    } catch (error) {
      console.log("Translator availability error", error);
      return;
    }

    const originalText = paragraph.innerText?.trim();
    if (!originalText) return;

    try {
      const translator = await self.Translator.create({
        sourceLanguage,
        targetLanguage
      });
      const translated = await translator.translate(originalText);
      paragraph.dataset.mirloOriginal = originalText;
      paragraph.dataset.mirloTranslated = translated;
      paragraph.dataset.mirloSource = sourceLanguage;
      paragraph.dataset.mirloTarget = targetLanguage;
      paragraph.classList.add("mirlo-translated");
      paragraph.classList.remove("mirlo-reverted");
      paragraph.dataset.mirloState = "translated";
      paragraph.innerText = translated;
      attachTooltipHandlers(paragraph);
    } catch (error) {
      console.log("Translation failed", error);
    }
  }

  function maybeTranslateParagraph() {
    const paragraph = findParagraphToTranslate();
    if (!paragraph) return;

    if (document.userActivation?.isActive || document.userActivation?.hasBeenActive) {
      translateParagraph(paragraph);
      return;
    }

    const onFirstClick = () => {
      document.removeEventListener("click", onFirstClick, true);
      translateParagraph(paragraph);
    };
    document.addEventListener("click", onFirstClick, true);
  }

  function ensureTooltip() {
    if (tooltipEl) return tooltipEl;
    tooltipEl = document.createElement("div");
    tooltipEl.className = "mirlo-tooltip";
    tooltipEl.innerHTML = `
      <div class="mirlo-tooltip-header">
        <div class="mirlo-tooltip-title">Spanish</div>
        <button class="mirlo-tooltip-button" type="button">Revert to English</button>
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

  function positionTooltip(target, tooltip) {
    const rect = target.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const left = rect.left + window.scrollX;
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.maxWidth = "360px";
  }

  function showTooltip(paragraph) {
    const tooltip = ensureTooltip();
    const bodyEl = tooltip.querySelector(".mirlo-tooltip-body");
    const button = tooltip.querySelector(".mirlo-tooltip-button");
    const state = paragraph.dataset.mirloState || "translated";
    const original = paragraph.dataset.mirloOriginal || "";
    const translated = paragraph.dataset.mirloTranslated || "";
    bodyEl.textContent = state === "translated" ? original : translated;
    button.textContent =
      state === "translated" ? "Switch to English" : "Switch to Spanish";
    button.onclick = () => toggleParagraphState(paragraph);

    positionTooltip(paragraph, tooltip);
    tooltip.classList.add("is-visible");
  }

  function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.remove("is-visible");
  }

  function scheduleTooltipHide() {
    if (tooltipHideTimer) window.clearTimeout(tooltipHideTimer);
    tooltipHideTimer = window.setTimeout(() => {
      if (!tooltipPinned) hideTooltip();
    }, 120);
  }

  function attachTooltipHandlers(paragraph) {
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

  function toggleParagraphState(paragraph) {
    const state = paragraph.dataset.mirloState || "translated";
    if (state === "translated") {
      paragraph.innerText = paragraph.dataset.mirloOriginal || "";
      paragraph.dataset.mirloState = "original";
      paragraph.classList.add("mirlo-reverted");
    } else {
      paragraph.innerText = paragraph.dataset.mirloTranslated || "";
      paragraph.dataset.mirloState = "translated";
      paragraph.classList.remove("mirlo-reverted");
    }
    showTooltip(paragraph);
  }

  function logAiStatus() {
    const hasTranslatorApi = "Translator" in self;
    if (hasTranslatorApi) {
      console.log("Translator API found");
    } else {
      console.log("Translator API missing");
    }
  }

  function shouldSkipNode(node) {
    if (!node || !node.parentElement) return true;
    if (node.parentElement.closest(SKIP_SELECTORS)) return true;
    if (node.parentElement.closest(`.${HIGHLIGHT_CLASS}`)) return true;
    if (!node.nodeValue || !node.nodeValue.trim()) return true;
    return false;
  }

  function highlightTextNode(node) {
    if (highlights >= MAX_HIGHLIGHTS) return;

    const text = node.nodeValue;
    const regex = new RegExp(`\\b${TARGET_WORD}\\b`, "gi");
    let match = null;
    let lastIndex = 0;
    let matched = false;
    const fragment = document.createDocumentFragment();

    while ((match = regex.exec(text)) && highlights < MAX_HIGHLIGHTS) {
      matched = true;
      const before = text.slice(lastIndex, match.index);
      if (before) fragment.append(document.createTextNode(before));

      const span = document.createElement("span");
      span.className = HIGHLIGHT_CLASS;
      span.textContent = match[0];
      fragment.append(span);

      highlights += 1;
      lastIndex = match.index + match[0].length;
    }

    if (!matched) return;

    const after = text.slice(lastIndex);
    if (after) fragment.append(document.createTextNode(after));

    node.parentNode.replaceChild(fragment, node);
  }

  function scanAndHighlight() {
    if (!document.body || highlights >= MAX_HIGHLIGHTS) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return shouldSkipNode(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    let current = walker.nextNode();
    while (current && highlights < MAX_HIGHLIGHTS) {
      nodes.push(current);
      current = walker.nextNode();
    }

    nodes.forEach(highlightTextNode);
  }

  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    window.setTimeout(() => {
      scheduled = false;
      scanAndHighlight();
    }, 200);
  }

  function init() {
    logAiStatus();
    scheduleScan();
    maybeTranslateParagraph();

    const observer = new MutationObserver(() => {
      if (highlights >= MAX_HIGHLIGHTS) return;
      scheduleScan();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type !== "mirlo:getLanguageInfo") return;
    getPageLanguageInfo()
      .then(sendResponse)
      .catch((error) => {
        sendResponse({
          error: error?.name || error?.message || "unknown-error"
        });
      });
    return true;
  });
})();
