const STORAGE_KEYS = {
  sourceLanguage: "mirlo:source_language",
  targetLanguage: "mirlo:target_language"
};

const DEFAULT_SOURCE = "en";
const DEFAULT_TARGET = "es";

const sourceSelect = document.getElementById("source-language");
const targetSelect = document.getElementById("target-language");
const saveButton = document.getElementById("save-button");
const statusEl = document.getElementById("save-status");

function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.sourceLanguage, STORAGE_KEYS.targetLanguage],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error("Storage read error:", chrome.runtime.lastError);
          resolve({ source: DEFAULT_SOURCE, target: DEFAULT_TARGET });
          return;
        }

        resolve({
          source: result[STORAGE_KEYS.sourceLanguage] || DEFAULT_SOURCE,
          target: result[STORAGE_KEYS.targetLanguage] || DEFAULT_TARGET
        });
      }
    );
  });
}

function saveSettings(source, target) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.sourceLanguage]: source,
        [STORAGE_KEYS.targetLanguage]: target
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Storage write error:", chrome.runtime.lastError);
          resolve(false);
          return;
        }
        resolve(true);
      }
    );
  });
}

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "options-status";
  statusEl.classList.add(`is-${type}`, "is-visible");

  window.setTimeout(() => {
    statusEl.classList.remove("is-visible");
  }, 2500);
}

function validateLanguages(source, target) {
  if (source === target) {
    return {
      valid: false,
      message: "Source and target languages must be different."
    };
  }
  return { valid: true };
}

async function init() {
  const settings = await getSettings();
  sourceSelect.value = settings.source;
  targetSelect.value = settings.target;
}

saveButton.addEventListener("click", async () => {
  const source = sourceSelect.value;
  const target = targetSelect.value;

  const validation = validateLanguages(source, target);
  if (!validation.valid) {
    showStatus(validation.message, "error");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  const saved = await saveSettings(source, target);

  if (saved) {
    showStatus("✓ Settings saved successfully!", "success");
    saveButton.textContent = "Saved!";
  } else {
    showStatus("Unable to save settings.", "error");
    saveButton.textContent = "Save Settings";
  }

  window.setTimeout(() => {
    saveButton.textContent = "Save Settings";
    saveButton.disabled = false;
  }, 1200);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
