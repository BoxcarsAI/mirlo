---
id: TASK-3
title: Localize Popup UI
status: Done
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 16:07'
labels: []
dependencies:
  - TASK-2
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extract all hardcoded strings from `popup.html` and `popup.js` into the English message bundle.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No hardcoded user-facing strings remain in popup.html
- [x] #2 popup.html uses data-i18n attributes for static text
- [x] #3 popup.js uses chrome.i18n.getMessage for any dynamic text
- [x] #4 All extracted strings are added to _locales/en/messages.json
- [x] #5 The popup renders correctly in English
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1.  **Extract Strings:** Identify all user-facing strings in `src/popup.html`.
    *   Title: "Mirlo"
    *   Loading: "Loading site…"
    *   Enabled/Disabled: "✓ Enabled", "Disabled"
    *   Buttons: "Disable", "Enable"
    *   Links: "Change languages →"
    *   Status labels: "AI Status:", "Page Language:"
2.  **Update Messages:** Add these keys to `src/_locales/en/messages.json`.
3.  **Update HTML:**
    *   Add `<script src="utils/i18n.js"></script>` to `popup.html`.
    *   Replace text with `data-i18n="key"` attributes.
4.  **Update JS:**
    *   Modify `src/popup.js` to use `chrome.i18n.getMessage()` for dynamic strings (e.g., status updates, toggle button text).
    *   Update `getLanguageName` to fetch localized language names if possible, or leave as simple mapping for now (Ticket 4 covers robust language lists).
5.  **Verification:**
    *   Reload extension.
    *   Verify popup text matches English strings.
    *   Toggle "Enable/Disable" to ensure dynamic text updates correctly.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed Task 3: Localize Popup UI.

**Changes:**
- Extracted all hardcoded strings from `src/popup.html` and `src/popup.js` to `src/_locales/en/messages.json`.
- Updated `src/popup.html` to use `data-i18n` attributes for static text, including initial status states.
- Updated `src/popup.js` to use `chrome.i18n.getMessage()` for dynamic text (status updates, buttons, language names).
- Localized the "LanguageDetector" technical prefix.
- Ensured `formatLanguage` uses localized language names via `getLanguageName`.
- Removed unused `popupChecking` key.

**Verification:**
- User verified the popup renders correctly in English.
- User verified dynamic string updates (e.g., button text) by modifying `messages.json` and reloading.
- Codebase investigator review passed after fixing identified issues (hardcoded initial HTML states, raw language codes).
<!-- SECTION:FINAL_SUMMARY:END -->
