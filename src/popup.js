const statusEl = document.getElementById("ai-status");
const languageEl = document.getElementById("page-language");

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

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  if (!tab?.id) {
    updateUi(null);
    return;
  }

  chrome.tabs.sendMessage(
    tab.id,
    { type: "mirlo:getLanguageInfo" },
    (response) => {
      if (chrome.runtime.lastError) {
        updateUi(null);
        return;
      }
      updateUi(response);
    }
  );
});
