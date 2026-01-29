---
id: TASK-6
title: Add Spanish Locale Support
status: To Do
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 15:40'
labels: []
dependencies:
  - TASK-3
  - TASK-4
  - TASK-5
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the Spanish translation file and verify the full localization flow.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 _locales/es/messages.json exists
- [ ] #2 All keys from en/messages.json are present in es/messages.json with valid Spanish translations
- [ ] #3 Switching the browser language to Spanish results in the extension UI displaying entirely in Spanish
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1.  **Preparation:** Ensure `src/_locales/en/messages.json` is complete (all previous tasks done).
2.  **Create Spanish Locale:**
    *   Create directory `src/_locales/es`.
    *   Copy `src/_locales/en/messages.json` to `src/_locales/es/messages.json`.
3.  **Translate:**
    *   Translate all "message" values in `es/messages.json` to Spanish.
    *   *Self-Correction:* Ensure placeholders (if any) are preserved.
4.  **Verification (The Big Test):**
    *   Go to Chrome Settings -> Languages.
    *   Add "Spanish" and move it to the top.
    *   Restart Chrome (or reload extension).
    *   **Check:**
        *   Popup UI is in Spanish.
        *   Options Page is in Spanish.
        *   Language dropdowns show "Inglés", "Español", etc.
        *   In-page Toast says "Activar Mirlo en...".
5.  **Finalize:** If all looks good, the MVP is complete.
<!-- SECTION:PLAN:END -->
