import { localizeHtmlPage } from "@/utils/i18n";
import { STORAGE_KEYS } from "@/utils/storage-keys";
import { SUPPORTED_LANGUAGES, getLanguageLabel, isSupportedLanguage } from "@/utils/languages";

localizeHtmlPage();

// The target defaults to Spanish — or English if the browser is already Spanish,
// since you don't pick your own language to learn.
const DEFAULT_LEARNING =
  chrome.i18n.getUILanguage()?.split("-")[0]?.toLowerCase() === "es" ? "en" : "es";

const learningSelect = document.getElementById("learning-language") as HTMLSelectElement;
const densitySelect = document.getElementById("translation-density") as HTMLSelectElement;
const saveButton = document.getElementById("save-button") as HTMLButtonElement;
const statusEl = document.getElementById("save-status")!;

const DEFAULT_DENSITY = "medium";

function getSettings(): Promise<{ learning: string; density: string }> {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.learningLanguage, STORAGE_KEYS.translationDensity],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error("Storage read error:", chrome.runtime.lastError);
          resolve({ learning: DEFAULT_LEARNING, density: DEFAULT_DENSITY });
          return;
        }

        resolve({
          learning: result[STORAGE_KEYS.learningLanguage] || DEFAULT_LEARNING,
          density: result[STORAGE_KEYS.translationDensity] || DEFAULT_DENSITY,
        });
      },
    );
  });
}

function saveSettings(learning: string, density: string): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.learningLanguage]: learning,
        [STORAGE_KEYS.translationDensity]: density,
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error("Storage write error:", chrome.runtime.lastError);
          resolve(false);
          return;
        }
        resolve(true);
      },
    );
  });
}

function showStatus(message: string, type: string): void {
  statusEl.textContent = message;
  statusEl.className = "options-status";
  statusEl.classList.add(`is-${type}`, "is-visible");

  setTimeout(() => {
    statusEl.classList.remove("is-visible");
  }, 2500);
}

function validateLanguage(learning: string): { valid: boolean; message?: string } {
  if (isSupportedLanguage(learning)) return { valid: true };
  return { valid: false, message: chrome.i18n.getMessage("optionsErrorUnsupportedLang") };
}

function populateLanguageSelects(): void {
  const languages = [...SUPPORTED_LANGUAGES].sort((a, b) =>
    a.english.localeCompare(b.english),
  );

  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.textContent = getLanguageLabel(lang.code);
    learningSelect.appendChild(option);
  });
}

async function init(): Promise<void> {
  populateLanguageSelects();
  const settings = await getSettings();
  learningSelect.value = settings.learning;
  densitySelect.value = settings.density;
}

saveButton.addEventListener("click", async () => {
  const learning = learningSelect.value;
  const density = densitySelect.value;

  const validation = validateLanguage(learning);
  if (!validation.valid) {
    showStatus(validation.message!, "error");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = chrome.i18n.getMessage("optionsSaveStatusSaving");

  const saved = await saveSettings(learning, density);

  if (saved) {
    showStatus(chrome.i18n.getMessage("optionsSaveStatusSuccess"), "success");
    saveButton.textContent = chrome.i18n.getMessage("optionsSaveStatusSaved");
  } else {
    showStatus(chrome.i18n.getMessage("optionsSaveStatusError"), "error");
    saveButton.textContent = chrome.i18n.getMessage("optionsSaveBtn");
  }

  setTimeout(() => {
    saveButton.textContent = chrome.i18n.getMessage("optionsSaveBtn");
    saveButton.disabled = false;
  }, 1200);
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
