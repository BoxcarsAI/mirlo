# Mirlo Code Snippets & Patterns

Quick reference for common patterns used in the Mirlo extension. Copy-paste these as starting points.

---

## Chrome Storage Patterns

### Reading from Storage

```javascript
// Single key
function getSetting(key, defaultValue) {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage read error:', chrome.runtime.lastError);
        resolve(defaultValue);
        return;
      }
      resolve(result[key] ?? defaultValue);
    });
  });
}

// Usage
const targetLang = await getSetting('mirlo:target_language', 'es');
```

```javascript
// Multiple keys
function getSettings(keys) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Storage read error:', chrome.runtime.lastError);
        resolve({});
        return;
      }
      resolve(result);
    });
  });
}

// Usage
const settings = await getSettings(['mirlo:source_language', 'mirlo:target_language']);
console.log(settings['mirlo:source_language']);
```

### Writing to Storage

```javascript
// Single key
function setSetting(key, value) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage write error:', chrome.runtime.lastError);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

// Usage
await setSetting('mirlo:target_language', 'fr');
```

```javascript
// Multiple keys
function setSettings(data) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        console.error('Storage write error:', chrome.runtime.lastError);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

// Usage
await setSettings({
  'mirlo:source_language': 'en',
  'mirlo:target_language': 'es'
});
```

### Listening to Storage Changes

```javascript
// Listen for changes from other tabs/contexts
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return;

  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'mirlo:target_language') {
      console.log(`Target language changed from ${oldValue} to ${newValue}`);
      // Update local state
      userTargetLanguage = newValue;
    }
  }
});
```

---

## Options Page Patterns

### Complete options.js Template

```javascript
// Storage keys
const STORAGE_KEYS = {
  sourceLanguage: 'mirlo:source_language',
  targetLanguage: 'mirlo:target_language'
};

// Defaults
const DEFAULTS = {
  source: 'en',  // English
  target: 'es'   // Spanish
};

// DOM elements
const sourceSelect = document.getElementById('source-language');
const targetSelect = document.getElementById('target-language');
const saveButton = document.getElementById('save-button');
const statusEl = document.getElementById('save-status');

// Language names (Beta: 4 tested languages)
const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German'
};

// Load settings from storage
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.sourceLanguage, STORAGE_KEYS.targetLanguage],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error('Load error:', chrome.runtime.lastError);
          resolve(DEFAULTS);
          return;
        }
        resolve({
          source: result[STORAGE_KEYS.sourceLanguage] || DEFAULTS.source,
          target: result[STORAGE_KEYS.targetLanguage] || DEFAULTS.target
        });
      }
    );
  });
}

// Save settings to storage
async function saveSettings(source, target) {
  return new Promise((resolve) => {
    const data = {
      [STORAGE_KEYS.sourceLanguage]: source,
      [STORAGE_KEYS.targetLanguage]: target
    };
    chrome.storage.sync.set(data, () => {
      if (chrome.runtime.lastError) {
        console.error('Save error:', chrome.runtime.lastError);
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}

// Validate language selection
function validateLanguages(source, target) {
  // Simple check: source and target must be different
  if (source === target) {
    return {
      valid: false,
      message: 'Source and target languages must be different'
    };
  }
  return { valid: true };
}

// Show status message
function showStatus(message, type = 'success') {
  statusEl.textContent = message;
  statusEl.className = `options-status is-${type}`;
  statusEl.classList.add('is-visible');

  setTimeout(() => {
    statusEl.classList.remove('is-visible');
  }, 3000);
}

// Initialize dropdowns with saved values
async function initialize() {
  const settings = await loadSettings();
  sourceSelect.value = settings.source;
  targetSelect.value = settings.target;
}

// Save button click handler
saveButton.addEventListener('click', async () => {
  const source = sourceSelect.value;
  const target = targetSelect.value;

  // Validate
  const validation = validateLanguages(source, target);
  if (!validation.valid) {
    showStatus(validation.message, 'error');
    return;
  }

  // Disable button during save
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';

  // Save
  const success = await saveSettings(source, target);

  if (success) {
    showStatus('✓ Settings saved!', 'success');
    saveButton.textContent = 'Saved!';
    setTimeout(() => {
      saveButton.textContent = 'Save Settings';
      saveButton.disabled = false;
    }, 1500);
  } else {
    showStatus('Failed to save. Please try again.', 'error');
    saveButton.textContent = 'Save Settings';
    saveButton.disabled = false;
  }
});

// Keyboard shortcut: Enter to save
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !saveButton.disabled) {
    saveButton.click();
  }
});

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
```

### Status Message Animation CSS

```css
.options-status {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  opacity: 0;
  transform: translateY(-8px);
  transition: all 200ms ease;
  pointer-events: none;
}

.options-status.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.options-status.is-success {
  background: var(--mirlo-green-100);
  color: var(--mirlo-green-600);
}

.options-status.is-error {
  background: var(--mirlo-red-100);
  color: var(--mirlo-red-600);
}

.options-status.is-info {
  background: var(--mirlo-blue-100);
  color: var(--mirlo-blue-600);
}
```

---

## Content Script Patterns

### Checking if Settings Match Page

```javascript
// Check if page language matches user's source preference
function shouldActivateOnPage(userSourceLanguage) {
  // Get page language
  const htmlLang = document.documentElement.lang || 'en';
  const pageLang = htmlLang.split('-')[0].toLowerCase();

  // Check if matches user's selected source language
  return pageLang === userSourceLanguage;
}

// Usage in activation flow
async function handleActivationFlow() {
  // Load language settings first
  await initializeLanguageSettings();

  const domain = normalizeDomain(location.hostname);
  if (!domain) return;

  const stored = await getStoredDomains();

  if (stored.enabled.includes(domain)) {
    // Only activate if page language matches source preference
    if (shouldActivateOnPage(userSourceLanguage)) {
      activateMirlo();
    } else {
      console.log(`Page language doesn't match source (${userSourceLanguage})`);
    }
    return;
  }

  // ... rest of activation logic
}
```

### Safe Language Name Lookup

```javascript
function getLanguageName(code) {
  const names = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German'
  };
  return names[code] || code.toUpperCase();
}

// Usage
console.log(getLanguageName('es')); // "Spanish"
console.log(getLanguageName('fr')); // "French"
console.log(getLanguageName('xyz')); // "XYZ" (fallback)
```

---

## Popup Patterns

### Opening Options Page

```javascript
// Button click handler
document.getElementById('open-options').addEventListener('click', (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});
```

### Querying Active Tab

```javascript
async function getActiveTab() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error('Tab query error:', chrome.runtime.lastError);
        resolve(null);
        return;
      }
      resolve(tabs[0] || null);
    });
  });
}

// Usage
const tab = await getActiveTab();
if (tab) {
  console.log('Current URL:', tab.url);
}
```

### Sending Message to Content Script

```javascript
function sendMessageToTab(tabId, message) {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Message send error:', chrome.runtime.lastError);
        resolve(null);
        return;
      }
      resolve(response);
    });
  });
}

// Usage
const response = await sendMessageToTab(tab.id, {
  type: 'mirlo:setActive',
  enabled: true
});
```

---

## CSS Patterns

### Custom Select Styling

```css
.options-select {
  /* Remove default styles */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* Custom styles */
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid var(--mirlo-slate-200);
  border-radius: var(--radius-md);
  background-color: var(--mirlo-white);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 10 13 14 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;

  font-family: var(--font-body);
  font-size: 16px;
  color: var(--mirlo-slate-900);
  cursor: pointer;

  transition: all var(--duration-normal) var(--ease-out);
}

.options-select:hover {
  border-color: var(--mirlo-slate-400);
}

.options-select:focus {
  outline: none;
  border-color: var(--mirlo-teal-700);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}

.options-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Hero Banner with Gradient

```css
.options-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  padding: var(--space-12) var(--space-6);
  background: var(--gradient-primary);
  text-align: center;
  overflow: hidden;
}

.options-hero-image {
  width: 160px;
  height: auto;
  margin-bottom: var(--space-6);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.options-hero-title {
  font-family: var(--font-heading);
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--mirlo-white);
  margin: 0 0 var(--space-3) 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.options-hero-subtitle {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .options-hero {
    min-height: 180px;
    padding: var(--space-8) var(--space-4);
  }

  .options-hero-image {
    width: 120px;
    margin-bottom: var(--space-4);
  }

  .options-hero-title {
    font-size: 32px;
  }

  .options-hero-subtitle {
    font-size: 16px;
  }
}
```

### Focus Visible (Keyboard Navigation)

```css
/* Remove default focus outline, add custom one */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: 2px solid var(--mirlo-teal-700);
  outline-offset: 2px;
}

/* Button specific focus */
button:focus-visible {
  outline: 2px solid var(--mirlo-teal-700);
  outline-offset: 2px;
}

/* Select specific focus */
select:focus-visible {
  outline: none;
  border-color: var(--mirlo-teal-700);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}
```

---

## HTML Patterns

### Options Page Structure

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mirlo Settings</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="options.css" />
</head>
<body>
  <!-- Hero Section -->
  <header class="options-hero">
    <img src="assets/mirlo.png" alt="Mirlo" class="options-hero-image" />
    <h1 class="options-hero-title">Mirlo Settings</h1>
    <p class="options-hero-subtitle">Learn languages naturally</p>
  </header>

  <!-- Main Content -->
  <main class="options-main">
    <div class="options-container">
      <section class="options-card">
        <h2 class="options-section-title">Language Preferences</h2>

        <!-- Source Language -->
        <div class="options-field">
          <label for="source-language" class="options-label">
            Source Language
            <span class="options-label-hint">The language you're reading</span>
          </label>
          <select id="source-language" class="options-select">
            <option value="auto">🔍 Auto-detect</option>
            <option value="en">🇬🇧 English</option>
            <option value="es">🇪🇸 Spanish</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
            <option value="pt">🇵🇹 Portuguese</option>
            <option value="it">🇮🇹 Italian</option>
            <option value="ja">🇯🇵 Japanese</option>
            <option value="zh">🇨🇳 Chinese</option>
          </select>
        </div>

        <!-- Target Language -->
        <div class="options-field">
          <label for="target-language" class="options-label">
            Target Language
            <span class="options-label-hint">The language you're learning</span>
          </label>
          <select id="target-language" class="options-select">
            <option value="es">🇪🇸 Spanish</option>
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 French</option>
            <option value="de">🇩🇪 German</option>
            <option value="pt">🇵🇹 Portuguese</option>
            <option value="it">🇮🇹 Italian</option>
            <option value="ja">🇯🇵 Japanese</option>
            <option value="zh">🇨🇳 Chinese</option>
          </select>
        </div>

        <!-- Save Button -->
        <button type="button" id="save-button" class="options-save-button">
          Save Settings
        </button>

        <!-- Status Message -->
        <div id="save-status" class="options-status" role="status" aria-live="polite"></div>
      </section>
    </div>
  </main>

  <script src="options.js"></script>
</body>
</html>
```

---

## Debugging Tips

### Check Chrome Storage

```javascript
// In console (popup, options, or content script)
chrome.storage.sync.get(null, (result) => {
  console.log('All stored data:', result);
});
```

### Clear Storage (for testing)

```javascript
// Clear all Mirlo settings
chrome.storage.sync.clear(() => {
  console.log('Storage cleared');
});

// Clear specific key
chrome.storage.sync.remove('mirlo:target_language', () => {
  console.log('Target language cleared');
});
```

### Log Content Script State

```javascript
// Add this to content.js for debugging
function logState() {
  console.log({
    mirloActive,
    userSourceLanguage,
    userTargetLanguage,
    activeParagraph,
    translatedParagraph
  });
}

// Call it
logState();
```

### Test Storage Events

```javascript
// Listen for changes (put in options.js or popup.js)
chrome.storage.onChanged.addListener((changes, areaName) => {
  console.log('Storage changed:', changes);
});
```

---

## Common Mistakes to Avoid

### ❌ Forgetting to Handle Errors

```javascript
// BAD
chrome.storage.sync.get(['key'], (result) => {
  const value = result.key; // Could be undefined if error occurred
});

// GOOD
chrome.storage.sync.get(['key'], (result) => {
  if (chrome.runtime.lastError) {
    console.error('Error:', chrome.runtime.lastError);
    return;
  }
  const value = result.key ?? defaultValue;
});
```

### ❌ Not Returning `true` for Async Messages

```javascript
// BAD - Response won't be sent
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  getDataAsync().then(sendResponse);
  // Missing: return true;
});

// GOOD
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  getDataAsync().then(sendResponse);
  return true; // Keep message channel open
});
```

### ❌ Using Synchronous Code with Storage

```javascript
// BAD - Won't work
let language = null;
chrome.storage.sync.get(['lang'], (result) => {
  language = result.lang;
});
console.log(language); // Still null!

// GOOD - Use async/await or callbacks
async function getLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['lang'], (result) => {
      resolve(result.lang);
    });
  });
}
const language = await getLanguage();
console.log(language); // Works!
```

### ❌ Forgetting to Reload Extension

After changing code, always:
1. Go to chrome://extensions
2. Click "Reload" button under your extension
3. Reload any pages where content script runs

---

## Testing Checklist

Before marking a ticket complete:

- [ ] No console errors in DevTools
- [ ] Tested on multiple websites
- [ ] Tested responsive design (resize window)
- [ ] Tested keyboard navigation (Tab through elements)
- [ ] Settings persist after browser restart
- [ ] Works with all language combinations
- [ ] UI matches brand guidelines
- [ ] Animations are smooth
- [ ] All text is spelled correctly

---

## Quick Reference Links

- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/)
- [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/)
- [chrome.tabs](https://developer.chrome.com/docs/extensions/reference/tabs/)
- [chrome.runtime](https://developer.chrome.com/docs/extensions/reference/runtime/)
- [Manifest V3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Google Fonts](https://fonts.google.com/)

---

Good luck with the implementation! 🚀
