---
id: TASK-3
title: Localize Popup UI
status: To Do
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 15:40'
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
- [ ] #1 No hardcoded user-facing strings remain in popup.html
- [ ] #2 popup.html uses data-i18n attributes for static text
- [ ] #3 popup.js uses chrome.i18n.getMessage for any dynamic text
- [ ] #4 All extracted strings are added to _locales/en/messages.json
- [ ] #5 The popup renders correctly in English
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
