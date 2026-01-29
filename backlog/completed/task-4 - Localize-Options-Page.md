---
id: TASK-4
title: Localize Options Page
status: Done
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 17:03'
labels: []
dependencies:
  - TASK-2
priority: medium
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Extract strings from the Options page. Crucially, ensure the "Language" dropdown options are translatable so "German" can become "Alemán".
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 No hardcoded user-facing strings remain in options.html
- [x] #2 options.js uses chrome.i18n.getMessage for dynamic text and status messages
- [x] #3 The list of available languages (English, Spanish, French, German) is localized
- [x] #4 All extracted strings are added to _locales/en/messages.json
- [x] #5 The Options page renders correctly in English
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1.  **Extract Strings:** Identify strings in `src/options.html` and `src/options.js`.
    *   HTML: Titles, descriptions, labels ("Native Language", "Learning Language"), button text ("Save Settings"), hints.
    *   JS: Status messages ("Settings saved", "Native and learning languages must be different").
2.  **Language List Logic:**
    *   The `options.html` currently has hardcoded `<option>` elements for languages.
    *   **Refactor:** Remove hardcoded options from HTML.
    *   **New Logic:** Generate options dynamically in `options.js`.
    *   For each language code (`en`, `es`, `fr`, `de`):
        *   Create an entry in `messages.json` (e.g., `lang_en`, `lang_es`).
        *   Use `chrome.i18n.getMessage` to populate the dropdown text.
        *   *Result:* When UI is Spanish, "English" shows as "Inglés" (pulled from `es/messages.json`).
3.  **Update Messages:** Add all new keys to `src/_locales/en/messages.json`.
4.  **Update HTML:** Add `<script src="utils/i18n.js"></script>` and `data-i18n` attributes.
5.  **Update JS:**
    *   Use `chrome.i18n.getMessage` for status updates.
    *   Implement the dynamic dropdown population.
6.  **Verification:**
    *   Reload options page.
    *   Verify all text is present and correct in English.
    *   Verify dropdowns are populated and work for saving settings.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Localized the Options page by extracting all user-facing strings into `src/_locales/en/messages.json`. Updated `src/options.html` with `data-i18n` attributes and included the `utils/i18n.js` utility. Refactored `src/options.js` to dynamically populate the language selection dropdowns with localized names and updated all status/validation messages to use `chrome.i18n.getMessage`. Verified consistency and security via `codebase_investigator` review.
<!-- SECTION:FINAL_SUMMARY:END -->
