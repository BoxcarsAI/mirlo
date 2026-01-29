---
id: TASK-2
title: HTML Localization Utility
status: Done
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 15:57'
labels: []
dependencies:
  - TASK-1
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a reusable JavaScript utility to handle text replacement in HTML files (Popup and Options pages). This prevents code duplication.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A reusable function/module exists (e.g., in a shared utility file or as a snippet)
- [x] #2 The utility finds elements with data-i18n attributes
- [x] #3 The utility sets the innerText (or appropriate property) using chrome.i18n.getMessage
- [x] #4 The utility handles different target attributes if necessary (e.g., placeholder, title)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1.  **Create File:** Create `src/utils/i18n.js`.
2.  **Define Function:** Implement `localizeHtmlPage()` function.
3.  **Selector Logic:** Use `document.querySelectorAll('[data-i18n]')` to find elements.
4.  **Attribute Handling:**
    *   `data-i18n`: Set `textContent`.
    *   `data-i18n-placeholder`: Set `placeholder` attribute.
    *   `data-i18n-title`: Set `title` attribute.
    *   `data-i18n-aria-label`: Set `aria-label` attribute.
    *   `data-i18n-value`: Set `value` attribute (for buttons/inputs).
    *   `data-i18n-alt`: Set `alt` attribute (for images).
5.  **Runtime Execution:** Add `document.addEventListener('DOMContentLoaded', localizeHtmlPage)` to auto-run.
6.  **Verification:** Review code to ensure no external dependencies are required.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented a reusable `localizeHtmlPage` utility in `src/utils/i18n.js`.
- Automatically localizes elements with `data-i18n` (textContent) and other `data-i18n-*` attributes (placeholder, title, etc.).
- Uses `chrome.i18n.getMessage` for translations.
- Includes auto-run logic on `DOMContentLoaded`.
- Refined after a `codebase_investigator` review to ensure secure usage of `textContent` and correct attribute handling for different element types.
<!-- SECTION:FINAL_SUMMARY:END -->
