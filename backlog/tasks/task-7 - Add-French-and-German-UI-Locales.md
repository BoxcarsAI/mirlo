---
id: TASK-7
title: Add French and German UI Locales
status: Done
assignee: []
created_date: '2026-01-29 19:56'
updated_date: '2026-01-29 20:18'
labels: []
milestone: GA - i18n Launch (Core 4)
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the missing locale files for French (fr) and German (de) to match the extension's supported translation languages.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 _locales/fr/messages.json exists with all keys from en/messages.json.
- [ ] #2 _locales/de/messages.json exists with all keys from en/messages.json.
- [ ] #3 UI correctly renders in French and German when browser language is switched.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
**Plan:**
1.  **Structure:** Create directories `src/_locales/fr/` and `src/_locales/de/`.
2.  **Content:** Create `messages.json` in each directory.
3.  **Keys:** Copy all keys from `src/_locales/en/messages.json` (appName, appDesc, popup*, options*, etc.).
4.  **Values:** Translate the English "message" fields to French and German respectively.
    *   *Note:* Ensure placeholders like `$STATUS$` and `$LANG$` are preserved exactly.
    *   *Note:* Ensure CSS/Structure related keys (like flags in `langEnFull`) are appropriate (e.g., German flag for "German" entry).
5.  **Verification:**
    *   Load unpacked extension.
    *   Go to chrome://settings/languages and move French/German to the top.
    *   Verify extension UI switches language.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Successfully created `_locales/fr/messages.json` and `_locales/de/messages.json`.

Verified:
1.  All keys from `en` are present in `fr` and `de`.
2.  Placeholders (`$STATUS$`, `$LANG$`) are preserved.
3.  JSON structure is valid.
4.  Codebase investigator confirmed 100% key match.

The extension now supports UI localization for French and German.
<!-- SECTION:FINAL_SUMMARY:END -->
