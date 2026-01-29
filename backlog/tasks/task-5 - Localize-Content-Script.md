---
id: TASK-5
title: Localize Content Script
status: To Do
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 16:55'
labels: []
dependencies:
  - TASK-1
priority: medium
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update the content script to use localized strings for injected UI elements (tooltips, popovers, error messages).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 content.js (and any related injected scripts) uses chrome.i18n.getMessage for all text
- [ ] #2 All extracted strings are added to _locales/en/messages.json
- [ ] #3 In-page translation UI renders correctly in English
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1.  **Extract Strings:** Identify user-facing strings in `src/content.js`.
    *   Toast UI: "Enable Mirlo on...", "Enable", "Not now".
    *   Tooltip UI: "Switch to...", "Spanish", "English".
    *   Badges/Labels: "Translate with Mirlo".
2.  **Update Messages:** Add these keys to `src/_locales/en/messages.json`.
3.  **Update JS:**
    *   Replace hardcoded strings with `chrome.i18n.getMessage()`.
    *   *Note:* `content.js` runs in the context of the page but has access to `chrome.i18n` (unlike standard web scripts).
4.  **Language Handling:**
    *   `getLanguageName` function inside `content.js` currently has hardcoded names. Update this to use localized names (similar to Options page logic, or keep simple if `chrome.i18n` makes more sense here). *Decision: Use `chrome.i18n` keys for languages (e.g., `lang_es`) to ensure consistency.*
5.  **Verification:**
    *   Visit a test article.
    *   Verify the "Enable Mirlo" toast appears with correct English text.
    *   Verify tooltips show correct English text.
<!-- SECTION:PLAN:END -->
