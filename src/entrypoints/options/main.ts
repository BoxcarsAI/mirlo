import { localizeHtmlPage } from "@/utils/i18n";
import { STORAGE_KEYS } from "@/utils/storage-keys";

localizeHtmlPage();

const DEFAULT_NATIVE = "en";
const DEFAULT_LEARNING = "es";

const nativeSelect = document.getElementById("native-language") as HTMLSelectElement;
const learningSelect = document.getElementById("learning-language") as HTMLSelectElement;
const saveButton = document.getElementById("save-button") as HTMLButtonElement;
const statusEl = document.getElementById("save-status")!;

function getSettings(): Promise<{ native: string; learning: string }> {
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
          learning: result[STORAGE_KEYS.learningLanguage] || DEFAULT_LEARNING,
        });
      },
    );
  });
}

function saveSettings(native: string, learning: string): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.nativeLanguage]: native,
        [STORAGE_KEYS.learningLanguage]: learning,
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

function validateLanguages(
  native: string,
  learning: string,
): { valid: boolean; message?: string } {
  if (native === learning) {
    return {
      valid: false,
      message: chrome.i18n.getMessage("optionsErrorSameLang"),
    };
  }
  return { valid: true };
}

function populateLanguageSelects(): void {
  const languages = [
    { code: "en", name: chrome.i18n.getMessage("langEnFull") },
    { code: "es", name: chrome.i18n.getMessage("langEsFull") },
    { code: "fr", name: chrome.i18n.getMessage("langFrFull") },
    { code: "de", name: chrome.i18n.getMessage("langDeFull") },
  ];

  [nativeSelect, learningSelect].forEach((select) => {
    languages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang.code;
      option.textContent = lang.name;
      select.appendChild(option);
    });
  });
}

async function init(): Promise<void> {
  populateLanguageSelects();
  const settings = await getSettings();
  nativeSelect.value = settings.native;
  learningSelect.value = settings.learning;
}

saveButton.addEventListener("click", async () => {
  const native = nativeSelect.value;
  const learning = learningSelect.value;

  const validation = validateLanguages(native, learning);
  if (!validation.valid) {
    showStatus(validation.message!, "error");
    return;
  }

  saveButton.disabled = true;
  saveButton.textContent = chrome.i18n.getMessage("optionsSaveStatusSaving");

  const saved = await saveSettings(native, learning);

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
