# Mirlo Options Page Implementation Tickets

These tickets implement a configuration panel for language selection, replacing the hardcoded English→Spanish translation with user-selectable source and target languages.

## Beta MVP Scope

**Languages Supported (4 tested pairs):**
- 🇬🇧 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)

**Why These?**
- Known to work reliably with Chrome's Translator API
- Cover 80% of language learning use cases
- Simple UX - no "not available" errors
- Easy to test thoroughly (12 combinations)

**Future Expansion:**
Add more languages after beta based on user requests and testing.

---

## MIRLO-OPT-001: Create Options Page Foundation - COMPLETED

**Priority:** P0 (Critical)
**Estimated Complexity:** Simple
**Dependencies:** None

### Description
Create the basic options page structure with Chrome extension manifest integration and navigation.

### Implementation Steps

1. **Create `src/options.html`**
   - Basic HTML structure with header, main content area, and save button
   - Link to new `options.css` stylesheet
   - Include `options.js` script
   - Add semantic HTML for accessibility

2. **Create `src/options.css`**
   - Import Google Fonts (Inter for body, Manrope for headings)
   - Set up CSS custom properties for brand colors (see `brand.md`)
   - Create base layout styles
   - Add responsive design (mobile-friendly)

3. **Create `src/options.js`**
   - Basic initialization
   - Load current settings from chrome.storage.sync
   - Save settings handler
   - Show success feedback on save

4. **Update `src/manifest.json`**
   - Add options page declaration:
   ```json
   "options_page": "options.html",
   "options_ui": {
     "page": "options.html",
     "open_in_tab": true
   }
   ```

### File Structure
```
src/
├── options.html       (new)
├── options.css        (new)
├── options.js         (new)
└── manifest.json      (update)
```

### Acceptance Criteria
- [x] Right-click extension icon shows "Options" menu item
- [x] Clicking "Options" opens the options page in a new tab
- [x] Page has proper HTML structure and loads without errors
- [x] Basic styling is applied (fonts, colors, layout)

### Testing
1. Load extension in Chrome
2. Right-click extension icon in toolbar
3. Click "Options" - verify page opens in new tab
4. Inspect page - verify no console errors
5. Check responsive design - resize browser window

---

## MIRLO-OPT-002: Design and Implement Options Page UI - COMPLETED

**Priority:** P0 (Critical)
**Estimated Complexity:** Medium
**Dependencies:** MIRLO-OPT-001

### Description
Build the beautiful, modern UI for the options page following brand guidelines in `brand.md`.

### Design Specifications

#### Layout Structure
```
┌─────────────────────────────────────────┐
│                                         │
│  [Hero Banner - Mirlo Bird + Gradient] │
│         Colorful, eye-catching          │
│              height: 200px              │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│         Settings Container              │
│        max-width: 600px                 │
│        margin: auto                     │
│        padding: 40px 24px               │
│                                         │
│   ┌─────────────────────────────────┐  │
│   │  Language Preferences           │  │
│   │                                 │  │
│   │  Source Language                │  │
│   │  [Dropdown with flag icons]     │  │
│   │                                 │  │
│   │  Target Language                │  │
│   │  [Dropdown with flag icons]     │  │
│   │                                 │  │
│   │  [Save Settings Button]         │  │
│   └─────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

#### Hero Banner
- Background: Linear gradient (see `brand.md` for colors)
- Center the mirlo.png image (resize to ~180px height)
- Add subtle animation (optional): bird "floats" gently
- Include tagline below image: "Learn languages naturally"

#### Language Selection Cards
- White background with subtle shadow
- Rounded corners (border-radius: 16px)
- Padding: 32px
- Smooth hover effects

#### Dropdowns
- Custom styled `<select>` elements or build custom dropdown
- Include flag emoji/icons for each language
- Options:
  - **Source Languages**: Auto-detect, English, Spanish, French, German, Portuguese, Italian, Japanese, Chinese
  - **Target Languages**: Spanish, English, French, German, Portuguese, Italian, Japanese, Chinese
- Font size: 16px
- Height: 48px
- Border-radius: 12px

#### Save Button
- Primary brand color background
- White text
- Width: 100%
- Height: 48px
- Border-radius: 12px
- Hover state: slightly darker
- Success state: green checkmark animation

### Implementation Notes

1. **HTML Structure** (`options.html`):
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mirlo Settings</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="options.css" />
</head>
<body>
  <div class="options-hero">
    <img src="assets/mirlo.png" alt="Mirlo" class="options-hero-image" />
    <h1 class="options-hero-title">Mirlo Settings</h1>
    <p class="options-hero-subtitle">Learn languages naturally</p>
  </div>

  <main class="options-main">
    <div class="options-card">
      <h2 class="options-section-title">Language Preferences</h2>

      <div class="options-field">
        <label for="source-language" class="options-label">
          Source Language
          <span class="options-label-hint">The language you're reading</span>
        </label>
        <select id="source-language" class="options-select">
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Spanish</option>
          <option value="fr">🇫🇷 French</option>
          <option value="de">🇩🇪 German</option>
        </select>
      </div>

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
        </select>
      </div>

      <button type="button" id="save-button" class="options-save-button">
        Save Settings
      </button>

      <div id="save-status" class="options-status" role="status" aria-live="polite"></div>
    </div>
  </main>

  <script src="options.js"></script>
</body>
</html>
```

2. **CSS Styling** (`options.css`):
   - Use CSS custom properties from brand.md
   - Implement smooth transitions (200-300ms)
   - Add focus states for accessibility
   - Mobile breakpoint: 640px

3. **Animation Effects**:
   - Save button: scale slightly on click
   - Success message: fade in from bottom
   - Hero image: subtle float animation (optional)

### Acceptance Criteria
- [x] Hero banner displays mirlo.png with gradient background
- [x] Both language dropdowns render with flag emojis
- [x] All fonts match brand guidelines (Inter/Manrope)
- [x] Colors match brand palette
- [x] Save button shows loading/success states
- [x] Page is fully responsive on mobile
- [x] All interactive elements have hover/focus states
- [x] Smooth animations on state changes

### Testing
1. Open options page - verify hero banner looks good
2. Check both dropdowns - verify all language options present
3. Test save button - verify smooth animation
4. Resize window - verify mobile responsiveness
5. Tab through elements - verify focus states visible
6. Test on different zoom levels (100%, 125%, 150%)

---

## MIRLO-OPT-003: Implement Options Page JavaScript Logic

**Priority:** P0 (Critical)
**Estimated Complexity:** Medium
**Dependencies:** MIRLO-OPT-002

### Description
Implement the JavaScript logic for loading, saving, and validating language preferences.

### Storage Schema
```javascript
// chrome.storage.sync
{
  "mirlo:source_language": "en",    // "en", "es", "fr", or "de" (default: English)
  "mirlo:target_language": "es",    // "en", "es", "fr", or "de" (default: Spanish)
  "mirlo:enabled_domains": [...],   // existing
  "mirlo:dismissed_domains": [...]  // existing
}
```

**Note:** We're keeping it simple with 4 tested language pairs for beta. No auto-detect option to reduce complexity.

### Implementation (`options.js`)

```javascript
const STORAGE_KEYS = {
  sourceLanguage: "mirlo:source_language",
  targetLanguage: "mirlo:target_language"
};

const DEFAULT_SOURCE = "en";  // English
const DEFAULT_TARGET = "es";  // Spanish

// DOM elements
const sourceSelect = document.getElementById("source-language");
const targetSelect = document.getElementById("target-language");
const saveButton = document.getElementById("save-button");
const statusEl = document.getElementById("save-status");

// Load saved settings
async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.sourceLanguage, STORAGE_KEYS.targetLanguage],
      (result) => {
        resolve({
          source: result[STORAGE_KEYS.sourceLanguage] || DEFAULT_SOURCE,
          target: result[STORAGE_KEYS.targetLanguage] || DEFAULT_TARGET
        });
      }
    );
  });
}

// Save settings
async function saveSettings(source, target) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.sourceLanguage]: source,
        [STORAGE_KEYS.targetLanguage]: target
      },
      () => resolve()
    );
  });
}

// Show status message
function showStatus(message, type = "success") {
  statusEl.textContent = message;
  statusEl.className = `options-status is-${type} is-visible`;
  setTimeout(() => {
    statusEl.classList.remove("is-visible");
  }, 3000);
}

// Validate selection
function validateLanguages(source, target) {
  // Can't have same source and target
  if (source === target) {
    return {
      valid: false,
      message: "Source and target languages must be different"
    };
  }
  return { valid: true };
}

// Initialize
async function init() {
  const settings = await loadSettings();
  sourceSelect.value = settings.source;
  targetSelect.value = settings.target;
}

// Save handler
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

  try {
    await saveSettings(source, target);
    showStatus("✓ Settings saved successfully!", "success");
    saveButton.textContent = "Saved!";
    setTimeout(() => {
      saveButton.textContent = "Save Settings";
      saveButton.disabled = false;
    }, 1500);
  } catch (error) {
    showStatus("Failed to save settings", "error");
    saveButton.textContent = "Save Settings";
    saveButton.disabled = false;
  }
});

// Run on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

### Error Handling
- Validate source ≠ target (unless source is auto)
- Handle chrome.storage errors gracefully
- Show user-friendly error messages
- Disable save button during save operation

### Acceptance Criteria
- [ ] Options page loads with saved settings
- [ ] Changing dropdowns updates internal state
- [ ] Save button saves to chrome.storage.sync
- [ ] Success message shows after save
- [ ] Validation prevents same source/target
- [ ] Error messages are user-friendly
- [ ] Settings persist across browser restarts

### Testing
1. Open options page - verify defaults load (English → Spanish)
2. Change both languages, save - verify success message
3. Close and reopen options - verify settings persisted
4. Try to set same source/target - verify error message
5. Check chrome.storage in DevTools - verify values saved correctly

---

## MIRLO-OPT-004: Update Content Script to Use Saved Languages

**Priority:** P0 (Critical)
**Estimated Complexity:** Medium
**Dependencies:** MIRLO-OPT-003

### Description
Modify `content.js` to read language preferences from storage and use them for translation and page detection.

### Changes to `content.js`

#### 1. Add Storage Keys and State
```javascript
// Add to top of file with other STORAGE_KEYS
const STORAGE_KEYS = {
  enabledDomains: "mirlo:enabled_domains",
  dismissedDomains: "mirlo:dismissed_domains",
  sourceLanguage: "mirlo:source_language",      // NEW
  targetLanguage: "mirlo:target_language"       // NEW
};

// Remove hardcoded constant
// const TRANSLATE_TARGET_LANGUAGE = "es";  // DELETE THIS

// Add state variables
let userSourceLanguage = "en";  // NEW - Default to English
let userTargetLanguage = "es";  // NEW - Default to Spanish
```

#### 2. Load Language Preferences
```javascript
async function getLanguagePreferences() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.sourceLanguage, STORAGE_KEYS.targetLanguage],
      (result) => {
        resolve({
          source: result[STORAGE_KEYS.sourceLanguage] || "en",
          target: result[STORAGE_KEYS.targetLanguage] || "es"
        });
      }
    );
  });
}

// Call this during initialization
async function initializeLanguageSettings() {
  const prefs = await getLanguagePreferences();
  userSourceLanguage = prefs.source;
  userTargetLanguage = prefs.target;
}
```

#### 3. Update Language Detection Logic
```javascript
// Modify getSourceLanguage() to use user preference
function getSourceLanguage() {
  // Simply return the user's selected source language
  return userSourceLanguage;
}
```

**Note:** We're keeping it simple - no auto-detect for beta. User explicitly chooses both languages.

#### 4. Update Translation to Use Target Language
```javascript
// In translateParagraph(), replace:
// const targetLanguage = TRANSLATE_TARGET_LANGUAGE;
// with:
const targetLanguage = userTargetLanguage;
```

#### 5. Only Show on Matching Language Pages
```javascript
// Update handleActivationFlow() to check page language
async function handleActivationFlow() {
  await initializeLanguageSettings(); // Load language prefs first

  const domain = normalizeDomain(location.hostname);
  if (!domain) return;

  const stored = await getStoredDomains();

  if (stored.enabled.includes(domain)) {
    // Check if page language matches source preference
    const pageLanguage = getHtmlLanguage().split("-")[0].toLowerCase();
    if (pageLanguage !== userSourceLanguage) {
      console.log(`Page language (${pageLanguage}) doesn't match source (${userSourceLanguage})`);
      return; // Don't activate
    }
    activateMirlo();
    return;
  }

  if (stored.dismissed.includes(domain)) return;
  if (!isArticleLike()) return;

  // Check page language before showing toast
  const pageLanguage = getHtmlLanguage().split("-")[0].toLowerCase();
  if (pageLanguage !== userSourceLanguage) {
    return; // Don't show toast
  }

  showActivationToast(domain);
}
```

**Behavior:** Mirlo only activates on pages that match the user's selected source language. For example, if source=English, Mirlo won't activate on Spanish pages.

#### 6. Update Tooltip Display
```javascript
// In showTooltip(), use dynamic language names
function getLanguageName(code) {
  const names = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German"
  };
  return names[code] || code.toUpperCase();
}

// Update tooltip title
function showTooltip(paragraph) {
  const tooltip = ensureTooltip();
  const bodyEl = tooltip.querySelector(".mirlo-tooltip-body");
  const titleEl = tooltip.querySelector(".mirlo-tooltip-title");
  const button = tooltip.querySelector(".mirlo-tooltip-button");

  const state = paragraph.dataset.mirloState || "translated";
  const original = paragraph.dataset.mirloOriginal || "";
  const translated = paragraph.dataset.mirloTranslated || "";
  const sourceLang = paragraph.dataset.mirloSource || userSourceLanguage;
  const targetLang = paragraph.dataset.mirloTarget || userTargetLanguage;

  titleEl.textContent = state === "translated"
    ? getLanguageName(targetLang)
    : getLanguageName(sourceLang);

  bodyEl.textContent = state === "translated" ? original : translated;

  button.textContent = state === "translated"
    ? `Switch to ${getLanguageName(sourceLang)}`
    : `Switch to ${getLanguageName(targetLang)}`;

  button.onclick = () => toggleParagraphState(paragraph);

  positionTooltip(paragraph, tooltip);
  tooltip.classList.add("is-visible");
}
```

### Acceptance Criteria
- [ ] Content script loads language preferences on page load
- [ ] Translation uses user-selected target language
- [ ] Source language detection respects user preference
- [ ] Mirlo only activates on pages matching source language
- [ ] Toast only appears on pages matching source language
- [ ] Tooltip shows correct language names
- [ ] Settings changes apply on next page load

### Testing
1. Set source=English, target=Spanish in options
2. Visit English article (Wikipedia, NYTimes) - verify Mirlo activates
3. Visit Spanish article - verify Mirlo does NOT activate
4. Translate a paragraph - verify uses Spanish
5. Change target to French in options
6. Reload English article - verify translation now uses French
7. Test all 12 combinations (4 sources × 3 targets excluding same language):
   - en→es, en→fr, en→de
   - es→en, es→fr, es→de
   - fr→en, fr→es, fr→de
   - de→en, de→es, de→fr

---

## MIRLO-OPT-005: Update Popup to Show Language Pair

**Priority:** P1 (Important)
**Estimated Complexity:** Simple
**Dependencies:** MIRLO-OPT-003

### Description
Update the extension popup to display current language configuration and provide a link to the options page.

### Changes to `popup.html`

```html
<!-- Add after the site-row div, before the divider -->
<div class="language-info">
  <div class="language-pair">
    <span class="language-badge" id="source-lang">English</span>
    <span class="language-arrow">→</span>
    <span class="language-badge" id="target-lang">Spanish</span>
  </div>
</div>

<!-- Replace the hardcoded "Target: Spanish" line with: -->
<p class="meta-line">
  <a href="#" id="open-options" class="options-link">Change languages →</a>
</p>
```

### Changes to `popup.html` styles

```css
/* Add to <style> block */
.language-info {
  margin-bottom: 10px;
}

.language-pair {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.language-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f0fdf4;
  color: #15803d;
  font-size: 11px;
  font-weight: 600;
}

.language-arrow {
  font-size: 14px;
  color: #9ca3af;
}

.options-link {
  color: #0f766e;
  text-decoration: none;
  font-weight: 500;
}

.options-link:hover {
  text-decoration: underline;
}
```

### Changes to `popup.js`

```javascript
// Add at top with other STORAGE_KEYS
const STORAGE_KEYS = {
  enabledDomains: "mirlo:enabled_domains",
  dismissedDomains: "mirlo:dismissed_domains",
  sourceLanguage: "mirlo:source_language",      // NEW
  targetLanguage: "mirlo:target_language"       // NEW
};

// Add DOM references
const sourceLangEl = document.getElementById("source-lang");
const targetLangEl = document.getElementById("target-lang");
const optionsLink = document.getElementById("open-options");

// Add language name helper
function getLanguageName(code) {
  const names = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German"
  };
  return names[code] || code.toUpperCase();
}

// Load and display language preferences
async function loadLanguagePreferences() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.sourceLanguage, STORAGE_KEYS.targetLanguage],
      (result) => {
        resolve({
          source: result[STORAGE_KEYS.sourceLanguage] || "en",
          target: result[STORAGE_KEYS.targetLanguage] || "es"
        });
      }
    );
  });
}

// Update initializePopup() to load languages
async function initializePopup(tab) {
  currentTabId = tab?.id ?? null;
  currentDomain = getDomainFromUrl(tab?.url);

  // Load and display language preferences
  const languages = await loadLanguagePreferences();
  sourceLangEl.textContent = getLanguageName(languages.source);
  targetLangEl.textContent = getLanguageName(languages.target);

  // ... rest of existing code
}

// Add options link handler
optionsLink.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});
```

### Acceptance Criteria
- [ ] Popup displays current language pair
- [ ] Language badges use brand colors
- [ ] "Change languages →" link opens options page
- [ ] Languages update when options are changed
- [ ] Layout still looks good on the small popup

### Testing
1. Open popup - verify shows default "English → Spanish"
2. Click "Change languages →" - verify options page opens
3. Change languages in options (e.g., French → German), save
4. Close and reopen popup - verify new languages displayed ("French → German")
5. Test with various language combinations from the 4 supported languages

---

## MIRLO-OPT-006: Add Settings Icon and Polish

**Priority:** P2 (Nice to Have)
**Estimated Complexity:** Simple
**Dependencies:** MIRLO-OPT-005

### Description
Add a small settings icon to the popup header and apply final polish to all UI elements.

### Enhancements

1. **Popup Header Icon**
   - Add small gear icon next to "Mirlo" title in popup
   - Clicking opens options page
   - Subtle, not distracting

2. **Options Page Enhancements**
   - Add keyboard shortcut support (Enter to save)
   - Add "Reset to defaults" button
   - Add helpful description text for each setting

3. **Accessibility Improvements**
   - Add ARIA labels to all interactive elements
   - Ensure proper focus management
   - Test with screen reader

4. **Animations**
   - Add smooth transitions between states
   - Success checkmark animation on save
   - Subtle hover effects on all buttons

### Acceptance Criteria
- [ ] Settings icon in popup header works
- [ ] Keyboard shortcuts function properly
- [ ] All ARIA labels present
- [ ] Animations smooth and not distracting
- [ ] Works well with reduced motion preference

### Testing
1. Test with keyboard only (Tab, Enter, Space)
2. Test with screen reader
3. Test with reduced motion enabled
4. Verify all animations smooth

---

## Implementation Order

1. **MIRLO-OPT-001** - Foundation (options page files, manifest)
2. **MIRLO-OPT-002** - UI Design (HTML/CSS, visual design)
3. **MIRLO-OPT-003** - Options Logic (save/load settings)
4. **MIRLO-OPT-004** - Content Script Integration (use settings)
5. **MIRLO-OPT-005** - Popup Updates (show language pair)
6. **MIRLO-OPT-006** - Polish (icons, animations, a11y)

---

## Testing Checklist

After completing all tickets, test the full flow:

- [ ] Install extension fresh (no previous settings)
- [ ] Verify defaults: English → Spanish
- [ ] Open options, change to English → French, save
- [ ] Visit English article (Wikipedia, NYTimes) - verify Mirlo activates
- [ ] Translate paragraph - verify uses French
- [ ] Visit French article - verify Mirlo does NOT activate (wrong source language)
- [ ] Open popup - verify shows "English → French"
- [ ] Change to French → English in options
- [ ] Visit French article - verify Mirlo now activates
- [ ] Translate paragraph - verify uses English
- [ ] Test all 12 language pair combinations work correctly
- [ ] Test on multiple websites (Wikipedia, NYTimes, Medium, BBC)
- [ ] Test popup and options on different screen sizes
- [ ] Test keyboard navigation throughout
- [ ] Verify no console errors anywhere

---

## Resources for Junior Developer

### Chrome Extension APIs to Study
- [chrome.storage.sync](https://developer.chrome.com/docs/extensions/reference/storage/) - Used for saving settings
- [chrome.runtime.openOptionsPage()](https://developer.chrome.com/docs/extensions/reference/runtime/#method-openOptionsPage) - Opens options page
- [Manifest V3 options_page](https://developer.chrome.com/docs/extensions/mv3/options/) - Options page declaration

### Useful Links
- [Google Fonts](https://fonts.google.com/) - For Inter and Manrope fonts
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) - For brand color variables
- [MDN: HTML select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) - For dropdown styling
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - For accessibility

### Design Inspiration
- [Toucan](https://jointoucan.com/) - Language learning extension (competitor)
- [Duolingo](https://www.duolingo.com/) - Colorful, friendly design
- [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) - Browse top extensions for UX patterns

### Testing Tools
- Chrome DevTools (F12) - Inspect elements, check console
- chrome://extensions - Reload extension, view errors
- Responsive Design Mode (Cmd+Shift+M / Ctrl+Shift+M) - Test mobile layout

---

## Common Pitfalls to Avoid

1. **Storage API is Asynchronous**
   - Always use Promises or callbacks
   - Don't try to read values synchronously
   - Handle errors gracefully

2. **Language Codes**
   - Use ISO 639-1 codes (2 letters: "en", "es")
   - Normalize to lowercase
   - Handle edge cases (auto-detect)

3. **Content Script Context**
   - Content script can't access options page directly
   - Must communicate via chrome.storage
   - Changes apply on next page load, not immediately

4. **CSS Specificity**
   - Extension CSS can conflict with page styles
   - Use specific class names (mirlo-*)
   - Test on various websites

5. **Manifest Permissions**
   - Need "storage" permission for chrome.storage
   - options_page must point to correct file
   - Reload extension after manifest changes

---

## Questions? Need Help?

If you get stuck:
1. Check Chrome DevTools console for errors
2. Verify manifest.json is valid JSON (use a validator)
3. Make sure extension is reloaded after code changes
4. Check that file paths in manifest are correct
5. Test chrome.storage in DevTools console:
   ```javascript
   chrome.storage.sync.get(null, console.log)
   ```

Good luck! 🎉
