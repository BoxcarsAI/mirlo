(() => {
  const SKIP_SELECTORS =
    "script,style,textarea,code,pre,svg,math,head,title,input,option,select,button";
  const TRANSLATE_TARGET_LANGUAGE = "es";

  let tooltipEl = null;
  let tooltipPinned = false;
  let tooltipHideTimer = null;
  let statusEl = null;
  let translationStart = null;
  let badgeEl = null;
  let activeParagraph = null;
  let translatedParagraph = null;
  let translatingParagraph = null;
  let translationRequestId = 0;

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

  function getParagraphText(paragraph) {
    if (!paragraph) return "";
    const walker = document.createTreeWalker(
      paragraph,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest(".mirlo-badge")) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let text = "";
    let current = walker.nextNode();
    while (current) {
      const value = current.nodeValue?.trim();
      if (value) {
        text = `${text} ${value}`.trim();
      }
      current = walker.nextNode();
    }

    return text;
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

  function isEligibleParagraph(paragraph) {
    if (!paragraph) return false;
    if (!isVisibleElement(paragraph)) return false;
    const text = paragraph.innerText?.trim();
    if (!text) return false;
    if (getWordCount(text) <= 15) return false;
    if (paragraph.classList.contains("mirlo-translated")) return false;
    return true;
  }

  function cancelInFlightTranslation() {
    translationRequestId += 1;
    translatingParagraph = null;
  }

  function applyTranslatedText(paragraph, translated, sourceLanguage, targetLanguage) {
    paragraph.dataset.mirloOriginal = paragraph.dataset.mirloOriginal || getParagraphText(paragraph);
    paragraph.dataset.mirloTranslated = translated;
    paragraph.dataset.mirloSource = sourceLanguage;
    paragraph.dataset.mirloTarget = targetLanguage;
    paragraph.classList.add("mirlo-translated");
    paragraph.classList.remove("mirlo-reverted");
    paragraph.dataset.mirloState = "translated";
    paragraph.innerText = translated;
    attachTooltipHandlers(paragraph);
    translatedParagraph = paragraph;
  }

  function revertParagraph(paragraph) {
    if (!paragraph) return;
    const original = paragraph.dataset.mirloOriginal;
    if (!original) return;
    paragraph.innerText = original;
    paragraph.dataset.mirloState = "original";
    paragraph.classList.add("mirlo-reverted");
    paragraph.classList.remove("mirlo-translated");
    if (translatedParagraph === paragraph) {
      translatedParagraph = null;
    }
  }

  async function translateParagraph(paragraph) {
    if (!paragraph) return;

    const cachedTranslation = paragraph.dataset.mirloTranslated;
    const cachedSource = paragraph.dataset.mirloSource;
    const cachedTarget = paragraph.dataset.mirloTarget;
    if (cachedTranslation && cachedSource && cachedTarget) {
      applyTranslatedText(paragraph, cachedTranslation, cachedSource, cachedTarget);
      setStatus("Translated (cached)");
      return;
    }

    const requestId = (translationRequestId += 1);
    translatingParagraph = paragraph;

    if (!("Translator" in self)) {
      setStatus("Translator unsupported");
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
      if (requestId !== translationRequestId) return;
      if (availability === "downloadable") {
        setStatus("Downloading model…");
      }
      if (availability !== "available" && availability !== "downloadable") {
        console.log("Translator unavailable:", availability);
        setStatus(`Translator ${availability}`);
        return;
      }
    } catch (error) {
      console.log("Translator availability error", error);
      setStatus("Translator unavailable");
      return;
    }

    const originalText = getParagraphText(paragraph);
    if (!originalText) return;

    try {
      setStatus("Preparing translator…");
      const translator = await self.Translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener("downloadprogress", (event) => {
            const percent = Math.round(event.loaded * 100);
            setStatus(`Downloading model… ${percent}%`);
          });
        }
      });
      if (requestId !== translationRequestId) return;
      translationStart = performance.now();
      setStatus("Translating…");
      const translated = await translator.translate(originalText);
      if (requestId !== translationRequestId) return;
      paragraph.dataset.mirloOriginal = originalText;
      applyTranslatedText(paragraph, translated, sourceLanguage, targetLanguage);
      const elapsedMs = performance.now() - (translationStart || performance.now());
      setStatus(`Translated (${(elapsedMs / 1000).toFixed(2)}s)`);
    } catch (error) {
      console.log("Translation failed", error);
      setStatus("Translation failed");
    }
  }

  function maybeTranslateParagraph() {
    setStatus("Hover a paragraph to translate");
  }

  function ensureStatus() {
    if (statusEl) return statusEl;
    statusEl = document.createElement("div");
    statusEl.className = "mirlo-status";
    statusEl.textContent = "Mirlo: Checking…";
    document.body.appendChild(statusEl);
    return statusEl;
  }

  function setStatus(message) {
    const status = ensureStatus();
    status.textContent = `Mirlo: ${message}`;
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

  function ensureBadge() {
    if (badgeEl) return badgeEl;
    badgeEl = document.createElement("button");
    badgeEl.type = "button";
    badgeEl.className = "mirlo-badge";
    badgeEl.innerHTML = `<span class="mirlo-badge-icon">🌐</span><span class="mirlo-badge-text">MIRLO</span>`;
    badgeEl.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (activeParagraph) {
        if (translatedParagraph === activeParagraph) {
          cancelInFlightTranslation();
          revertParagraph(activeParagraph);
          setStatus("Reverted to English");
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

  function showBadge(paragraph) {
    if (!paragraph) return;
    const badge = ensureBadge();
    if (badge.parentElement !== paragraph) {
      paragraph.appendChild(badge);
    }
    paragraph.classList.add("mirlo-hoverable");
    badge.classList.add("is-visible");
  }

  function hideBadge() {
    if (!badgeEl) return;
    badgeEl.classList.remove("is-visible");
  }

  function handleParagraphHover(target) {
    const paragraph = target?.closest?.("p");
    if (!paragraph || !isEligibleParagraph(paragraph)) {
      activeParagraph = null;
      hideBadge();
      return;
    }

    if (activeParagraph !== paragraph) {
      activeParagraph = paragraph;
      showBadge(paragraph);
      setStatus("Ready to translate");
    }
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
      paragraph.classList.remove("mirlo-translated");
      if (translatedParagraph === paragraph) {
        translatedParagraph = null;
      }
    } else {
      if (translatedParagraph && translatedParagraph !== paragraph) {
        revertParagraph(translatedParagraph);
      }
      paragraph.innerText = paragraph.dataset.mirloTranslated || "";
      paragraph.dataset.mirloState = "translated";
      paragraph.classList.remove("mirlo-reverted");
      paragraph.classList.add("mirlo-translated");
      translatedParagraph = paragraph;
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
    if (!node.nodeValue || !node.nodeValue.trim()) return true;
    return false;
  }

  function init() {
    logAiStatus();
    ensureStatus();
    setStatus("Checking…");
    maybeTranslateParagraph();
    document.addEventListener("mouseover", (event) => {
      handleParagraphHover(event.target);
    });
    document.addEventListener("mouseout", (event) => {
      const related = event.relatedTarget;
      if (related && badgeEl && badgeEl.contains(related)) return;
      if (!activeParagraph || !activeParagraph.contains(related)) {
        hideBadge();
      }
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
