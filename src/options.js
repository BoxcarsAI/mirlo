const STORAGE_KEYS = {
  nativeLanguage: "mirlo:native_language",
  learningLanguage: "mirlo:learning_language"
};

const DEFAULT_NATIVE = "en";
const DEFAULT_LEARNING = "es";

const nativeSelect = document.getElementById("native-language");
const learningSelect = document.getElementById("learning-language");
const saveButton = document.getElementById("save-button");
const statusEl = document.getElementById("save-status");

function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.nativeLanguage, STORAGE_KEYS.learningLanguage],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error("Storage read error:", chrome.runtime.lastError);
          resolve({ native: DEFAULT_NATIVE, learning: DEFAULT_LEARNING });
          return;
        }

        resolve({
          native: result[STORAGE_KEYS.nativeLanguage] || DEFAULT_NATIVE,
          learning: result[STORAGE_KEYS.learningLanguage] || DEFAULT_LEARNING
        });
      }
    );
  });
}

function saveSettings(native, learning) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.nativeLanguage]: native,
        [STORAGE_KEYS.learningLanguage]: learning
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

function validateLanguages(native, learning) {
  if (native === learning) {
    return {
      valid: false,
      message: "Native and learning languages must be different."
    };
  }
  return { valid: true };
}

async function init() {
  const settings = await getSettings();
  nativeSelect.value = settings.native;
  learningSelect.value = settings.learning;
}

saveButton.addEventListener("click", async () => {
  const native = nativeSelect.value;
  const learning = learningSelect.value;

  const validation = validateLanguages(native, learning);
  if (!validation.valid) {
    showStatus(validation.message, "error");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = "Saving...";

  const saved = await saveSettings(native, learning);

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
