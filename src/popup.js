const statusEl = document.getElementById("ai-status");
const languageEl = document.getElementById("page-language");
const domainEl = document.getElementById("site-domain");
const siteStatusEl = document.getElementById("site-status");
const toggleButton = document.getElementById("toggle-site");
const nativeLangEl = document.getElementById("native-lang");
const learningLangEl = document.getElementById("learning-lang");
const optionsLink = document.getElementById("open-options");

const STORAGE_KEYS = {
  enabledDomains: "mirlo:enabled_domains",
  dismissedDomains: "mirlo:dismissed_domains",
  nativeLanguage: "mirlo:native_language",
  learningLanguage: "mirlo:learning_language"
};

let currentDomain = "";
let currentEnabled = false;
let currentTabId = null;

function getLanguageName(code) {
  const names = {
    en: chrome.i18n.getMessage("langEn"),
    es: chrome.i18n.getMessage("langEs"),
    fr: chrome.i18n.getMessage("langFr"),
    de: chrome.i18n.getMessage("langDe")
  };
  return names[code] || (code ? code.toUpperCase() : "");
}

function loadLanguagePreferences() {
  return new Promise((resolve) => {
    if (!chrome?.storage?.sync) {
      resolve({ native: "en", learning: "es" });
      return;
    }
    chrome.storage.sync.get(
      [STORAGE_KEYS.nativeLanguage, STORAGE_KEYS.learningLanguage],
      (result) => {
        resolve({
          native: result?.[STORAGE_KEYS.nativeLanguage] || "en",
          learning: result?.[STORAGE_KEYS.learningLanguage] || "es"
        });
      }
    );
  });
}

function formatLanguage(info) {
  if (!info) return chrome.i18n.getMessage("popupUnknown");
  if (info.detectorResult?.detectedLanguage) {
    const confidence = Math.round(info.detectorResult.confidence * 100);
    const langName = getLanguageName(info.detectorResult.detectedLanguage);
    return `${langName} (${confidence}%)`;
  }
  if (info.htmlLang) return getLanguageName(info.htmlLang);
  return chrome.i18n.getMessage("popupUnknown");
}

function formatAiStatus(info) {
  if (!info) return chrome.i18n.getMessage("popupNotSupported");
  const detectorPrefix = chrome.i18n.getMessage("popupDetectorPrefix");
  const detector = info.detectorSupported
    ? `${detectorPrefix} ${info.detectorAvailability}`
    : chrome.i18n.getMessage("popupDetectorUnsupported");
  const translation = info.translationSupported
    ? chrome.i18n.getMessage("popupTranslationSupported")
    : chrome.i18n.getMessage("popupTranslationUnsupported");
  return `${detector}; ${translation}`;
}

function updateUi(info) {
  statusEl.textContent = chrome.i18n.getMessage("popupAiStatusFormat", [formatAiStatus(info)]);
  languageEl.textContent = chrome.i18n.getMessage("popupPageLangFormat", [formatLanguage(info)]);
}

function normalizeDomain(hostname) {
  if (!hostname) return "";
  return hostname.replace(/^www\./i, "").toLowerCase();
}

function getDomainFromUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.protocol.startsWith("http")) return "";
    return normalizeDomain(parsed.hostname);
  } catch (error) {
    return "";
  }
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

async function setDomainEnabled(domain, enabled) {
  const stored = await getStoredDomains();
  let nextEnabled = stored.enabled.filter((item) => item !== domain);
  if (enabled) {
    nextEnabled = [...new Set([...nextEnabled, domain])];
  }
  await setStoredDomains(STORAGE_KEYS.enabledDomains, nextEnabled);
  if (enabled) {
    const nextDismissed = stored.dismissed.filter((item) => item !== domain);
    await setStoredDomains(STORAGE_KEYS.dismissedDomains, nextDismissed);
  }
}

function setSiteUi({ domain, enabled, toggleDisabled }) {
  domainEl.textContent = domain ? domain : chrome.i18n.getMessage("popupSiteUnavailable");
  currentEnabled = Boolean(enabled);
  siteStatusEl.textContent = currentEnabled
    ? chrome.i18n.getMessage("popupStatusEnabled")
    : chrome.i18n.getMessage("popupStatusDisabled");
  siteStatusEl.classList.toggle("is-disabled", !currentEnabled);
  toggleButton.textContent = currentEnabled
    ? chrome.i18n.getMessage("popupDisableBtn")
    : chrome.i18n.getMessage("popupEnableBtn");
  toggleButton.classList.toggle("is-primary", !currentEnabled);
  toggleButton.disabled = Boolean(toggleDisabled);
}

async function initializePopup(tab) {
  currentTabId = tab?.id ?? null;
  currentDomain = getDomainFromUrl(tab?.url);

  const languages = await loadLanguagePreferences();
  if (nativeLangEl) nativeLangEl.textContent = getLanguageName(languages.native);
  if (learningLangEl) learningLangEl.textContent = getLanguageName(languages.learning);

  if (!currentDomain) {
    setSiteUi({ domain: chrome.i18n.getMessage("popupSiteUnavailable"), enabled: false, toggleDisabled: true });
    updateUi(null);
    return;
  }

  const stored = await getStoredDomains();
  setSiteUi({
    domain: currentDomain,
    enabled: stored.enabled.includes(currentDomain),
    toggleDisabled: false
  });

  chrome.tabs.sendMessage(
    currentTabId,
    { type: "mirlo:getLanguageInfo" },
    (response) => {
      if (chrome.runtime.lastError) {
        updateUi(null);
        return;
      }
      updateUi(response);
    }
  );
}

toggleButton.addEventListener("click", async () => {
  if (!currentDomain || !currentTabId) return;
  toggleButton.disabled = true;
  const nextEnabled = !currentEnabled;
  await setDomainEnabled(currentDomain, nextEnabled);
  setSiteUi({ domain: currentDomain, enabled: nextEnabled, toggleDisabled: false });
  chrome.tabs.sendMessage(
    currentTabId,
    { type: "mirlo:setActive", enabled: nextEnabled },
    () => {
      toggleButton.disabled = false;
    }
  );
});

optionsLink?.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  if (!tab?.id) {
    setSiteUi({ domain: chrome.i18n.getMessage("popupNoActiveTab"), enabled: false, toggleDisabled: true });
    updateUi(null);
    return;
  }
  initializePopup(tab);
});
