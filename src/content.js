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
  let listenersBound = false;
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
    badgeEl.setAttribute("aria-label", "Translate with Mirlo");
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
    if (!listenersBound) {
      listenersBound = true;
      document.addEventListener("mouseover", (event) => {
        if (!mirloActive) return;
        handleParagraphHover(event.target);
      });
      document.addEventListener("mouseout", (event) => {
        if (!mirloActive) return;
        const related = event.relatedTarget;
        if (related && badgeEl && badgeEl.contains(related)) return;
        if (!activeParagraph || !activeParagraph.contains(related)) {
          hideBadge();
        }
      });
    }
  }

  function deactivateMirlo() {
    if (!mirloActive) return;
    mirloActive = false;
    activeParagraph = null;
    cancelInFlightTranslation();
    hideBadge();
    hideTooltip();
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
    if (message?.type === "mirlo:getLanguageInfo") {
      getPageLanguageInfo()
        .then(sendResponse)
        .catch((error) => {
          sendResponse({
            error: error?.name || error?.message || "unknown-error"
          });
        });
      return true;
    }
    if (message?.type === "mirlo:setActive") {
      if (message?.enabled) {
        removeActivationToast();
        activateMirlo();
      } else {
        deactivateMirlo();
      }
      sendResponse({ active: mirloActive });
      return;
    }
  });
})();
