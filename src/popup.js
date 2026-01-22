const statusEl = document.getElementById("ai-status");
const languageEl = document.getElementById("page-language");
const domainEl = document.getElementById("site-domain");
const siteStatusEl = document.getElementById("site-status");
const toggleButton = document.getElementById("toggle-site");

const STORAGE_KEYS = {
  enabledDomains: "mirlo:enabled_domains",
  dismissedDomains: "mirlo:dismissed_domains"
};

let currentDomain = "";
let currentEnabled = false;
let currentTabId = null;

function formatLanguage(info) {
  if (!info) return "Unknown";
  if (info.detectorResult?.detectedLanguage) {
    const confidence = Math.round(info.detectorResult.confidence * 100);
    return `${info.detectorResult.detectedLanguage} (${confidence}%)`;
  }
  if (info.htmlLang) return info.htmlLang;
  return "Unknown";
}

function formatAiStatus(info) {
  if (!info) return "Not Supported";
  const detector = info.detectorSupported
    ? `LanguageDetector ${info.detectorAvailability}`
    : "LanguageDetector unsupported";
  const translation = info.translationSupported
    ? "Translation supported"
    : "Translation unsupported";
  return `${detector}; ${translation}`;
}

function updateUi(info) {
  statusEl.textContent = `AI Status: ${formatAiStatus(info)}`;
  languageEl.textContent = `Page Language: ${formatLanguage(info)}`;
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
  domainEl.textContent = domain ? domain : "Site unavailable";
  currentEnabled = Boolean(enabled);
  siteStatusEl.textContent = currentEnabled ? "✓ Enabled" : "Disabled";
  siteStatusEl.classList.toggle("is-disabled", !currentEnabled);
  toggleButton.textContent = currentEnabled ? "Disable" : "Enable";
  toggleButton.classList.toggle("is-primary", !currentEnabled);
  toggleButton.disabled = Boolean(toggleDisabled);
}

async function initializePopup(tab) {
  currentTabId = tab?.id ?? null;
  currentDomain = getDomainFromUrl(tab?.url);
  if (!currentDomain) {
    setSiteUi({ domain: "Site unavailable", enabled: false, toggleDisabled: true });
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

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  if (!tab?.id) {
    setSiteUi({ domain: "No active tab", enabled: false, toggleDisabled: true });
    updateUi(null);
    return;
  }
  initializePopup(tab);
});
