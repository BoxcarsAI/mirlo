(() => {
  const SKIP_SELECTORS =
    "script,style,textarea,code,pre,svg,math,head,title,input,option,select,button";
  const SKIP_CONTAINERS = [
    "nav",
    "header",
    "footer",
    "aside",
    "form",
    '[role="navigation"]',
    '[role="banner"]',
    '[role="contentinfo"]',
    '[role="complementary"]',
    '[role="search"]',
    '[role="form"]',
    ".sidebar",
    ".menu",
    ".nav",
    ".footer",
    ".header",
    ".comment",
    ".comments",
    ".ad",
    ".advertisement",
    ".promo",
    ".related",
    ".recommended",
    "#sidebar",
    "#menu",
    "#nav",
    "#footer",
    "#header",
    "#comments"
  ].join(",");
  const TRANSLATE_TARGET_LANGUAGE = "es";
  const STORAGE_KEYS = {
    enabledDomains: "mirlo:enabled_domains",
    dismissedDomains: "mirlo:dismissed_domains"
  };
  const TOAST_AUTO_DISMISS_MS = 8000;

  let tooltipEl = null;
  let tooltipPinned = false;
  let tooltipHideTimer = null;
  let translationStart = null;
  let badgeEl = null;
  let activeParagraph = null;
  let translatedParagraph = null;
  let translatingParagraph = null;
  let translationRequestId = 0;
  let mirloActive = false;
  let activationToastEl = null;
  let activationDismissTimer = null;
  const MARKER_TEXT = "·";

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

  function normalizeDomain(hostname) {
    if (!hostname) return "";
    return hostname.replace(/^www\./i, "").toLowerCase();
  }

  function normalizeDomainList(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map((domain) => (typeof domain === "string" ? normalizeDomain(domain) : ""))
      .filter(Boolean);
  }

  function getStoredDomains() {
    return new Promise((resolve) => {
      if (!chrome?.storage?.sync) {
        resolve({
          enabled: [],
          dismissed: []
        });
        return;
      }
      chrome.storage.sync.get(
        [STORAGE_KEYS.enabledDomains, STORAGE_KEYS.dismissedDomains],
        (result) => {
          if (chrome.runtime?.lastError) {
            resolve({
              enabled: [],
              dismissed: []
            });
            return;
          }
          resolve({
            enabled: normalizeDomainList(result?.[STORAGE_KEYS.enabledDomains]),
            dismissed: normalizeDomainList(result?.[STORAGE_KEYS.dismissedDomains])
          });
        }
      );
    });
  }

  function setStoredDomains(key, domains) {
    return new Promise((resolve) => {
      if (!chrome?.storage?.sync) {
        resolve();
        return;
      }
      chrome.storage.sync.set({ [key]: domains }, () => resolve());
    });
  }

  async function addDomainToList(key, domain) {
    const stored = await getStoredDomains();
    const list = key === STORAGE_KEYS.enabledDomains ? stored.enabled : stored.dismissed;
    if (!list.includes(domain)) {
      list.push(domain);
      await setStoredDomains(key, list);
    }
    return list;
  }

  async function removeDomainFromList(key, domain) {
    const stored = await getStoredDomains();
    const list = key === STORAGE_KEYS.enabledDomains ? stored.enabled : stored.dismissed;
    const next = list.filter((item) => item !== domain);
    if (next.length !== list.length) {
      await setStoredDomains(key, next);
    }
    return next;
  }

  function hasOgArticleMeta() {
    const meta = document.querySelector('meta[property="og:type"]');
    if (!meta) return false;
    const content = meta.getAttribute("content") || "";
    return content.trim().toLowerCase() === "article";
  }

  function hasArticleSchema() {
    const scripts = Array.from(
      document.querySelectorAll('script[type="application/ld+json"]')
    );
    for (const script of scripts) {
      const jsonText = script.textContent?.trim();
      if (!jsonText) continue;
      try {
        const parsed = JSON.parse(jsonText);
        const nodes = Array.isArray(parsed) ? parsed : [parsed];
        for (const node of nodes) {
          const typeValue = node?.["@type"];
          const types = Array.isArray(typeValue) ? typeValue : [typeValue];
          if (types.some((type) => ["Article", "NewsArticle", "BlogPosting"].includes(type))) {
            return true;
          }
        }
      } catch (error) {
        continue;
      }
    }
    return false;
  }

  function urlLooksLikeArticle() {
    const path = `${location.pathname || ""}`.toLowerCase();
    return ["/article/", "/post/", "/blog/", "/news/", "/story/"].some((segment) =>
      path.includes(segment)
    );
  }

  function hasParagraphHeuristic() {
    const paragraphs = Array.from(document.querySelectorAll("p"));
    let qualifying = 0;
    for (const paragraph of paragraphs) {
      if (!isVisibleElement(paragraph)) continue;
      const text = paragraph.innerText?.trim();
      if (!text) continue;
      if (getWordCount(text) < 15) continue;
      qualifying += 1;
      if (qualifying >= 3) return true;
    }
    return false;
  }

  function isArticleLike() {
    if (hasOgArticleMeta()) return true;
    if (hasArticleSchema()) return true;
    if (urlLooksLikeArticle()) return true;
    return hasParagraphHeuristic();
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
    if (element.closest(SKIP_CONTAINERS)) return false;
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

  function appendMarker(paragraph) {
    if (!paragraph) return;
    const existing = paragraph.querySelector(".mirlo-marker");
    if (existing) existing.remove();
    const marker = document.createElement("span");
    marker.className = "mirlo-marker";
    marker.textContent = MARKER_TEXT;
    paragraph.appendChild(marker);
  }

  function applyTranslatedText(paragraph, translated, sourceLanguage, targetLanguage) {
    paragraph.dataset.mirloOriginal = paragraph.dataset.mirloOriginal || getParagraphText(paragraph);
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

  function revertParagraph(paragraph) {
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

  async function translateParagraph(paragraph) {
    if (!paragraph) return;

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

    const sourceLanguage = getSourceLanguage();
    const targetLanguage = TRANSLATE_TARGET_LANGUAGE;

    try {
      const availability = await self.Translator.availability({
        sourceLanguage,
        targetLanguage
      });
      if (requestId !== translationRequestId) return;
      if (availability === "downloadable") {
      }
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
      const translator = await self.Translator.create({
        sourceLanguage,
        targetLanguage,
        monitor(m) {
          m.addEventListener("downloadprogress", (event) => {
            const percent = Math.round(event.loaded * 100);
          });
        }
      });
      if (requestId !== translationRequestId) return;
      translationStart = performance.now();
      const translated = await translator.translate(originalText);
      if (requestId !== translationRequestId) return;
      paragraph.dataset.mirloOriginal = originalText;
      applyTranslatedText(paragraph, translated, sourceLanguage, targetLanguage);
      const elapsedMs = performance.now() - (translationStart || performance.now());
    } catch (error) {
      console.log("Translation failed", error);
    }
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
    badgeEl.title = "Translate with Mirlo";
    badgeEl.textContent = "🌐";
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

  function activateMirlo() {
    if (mirloActive) return;
    mirloActive = true;
    logAiStatus();
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

  function removeActivationToast() {
    if (!activationToastEl) return;
    activationToastEl.classList.remove("is-visible");
    activationToastEl.classList.add("is-hiding");
    window.setTimeout(() => {
      activationToastEl?.remove();
      activationToastEl = null;
    }, 200);
  }

  function showActivationToast(domain) {
    if (activationToastEl || mirloActive) return;
    activationToastEl = document.createElement("div");
    activationToastEl.className = "mirlo-toast";
    activationToastEl.innerHTML = `
      <div class="mirlo-toast-icon">🌐</div>
      <div class="mirlo-toast-content">
        <div class="mirlo-toast-title">Enable Mirlo on ${domain}?</div>
        <div class="mirlo-toast-actions">
          <button class="mirlo-toast-button is-primary" type="button">Enable</button>
          <button class="mirlo-toast-button" type="button">Not now</button>
        </div>
      </div>
    `;

    const [enableButton, dismissButton] =
      activationToastEl.querySelectorAll(".mirlo-toast-button");

    const cleanupTimers = () => {
      if (activationDismissTimer) {
        window.clearTimeout(activationDismissTimer);
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

    activationDismissTimer = window.setTimeout(() => {
      dismissToast();
    }, TOAST_AUTO_DISMISS_MS);
  }

  async function handleActivationFlow() {
    const domain = normalizeDomain(location.hostname);
    if (!domain) return;
    const stored = await getStoredDomains();
    if (stored.enabled.includes(domain)) {
      activateMirlo();
      return;
    }
    if (stored.dismissed.includes(domain)) return;
    if (!isArticleLike()) return;
    showActivationToast(domain);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", handleActivationFlow, { once: true });
  } else {
    handleActivationFlow();
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
