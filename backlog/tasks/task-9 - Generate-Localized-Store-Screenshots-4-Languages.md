---
id: TASK-9
title: Generate Localized Store Screenshots (4 Languages)
status: To Do
assignee: []
created_date: '2026-01-29 19:56'
updated_date: '2026-01-29 20:14'
labels: []
milestone: GA - i18n Launch (Core 4)
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Capture and organize localized screenshots for the Chrome Web Store listing.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Set of 3-5 screenshots for each language (En, Es, Fr, De).
- [ ] #2 Screenshots follow Chrome Web Store size requirements (1280x800 or 640x400).
- [ ] #3 Screenshots show the UI localized in the respective language.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
**Plan:**
1.  **Prerequisites:** Complete Task 7 so the extension supports the new languages.
2.  **Environment:** Use a standardized window size (1280x800 viewport).
3.  **Process (Repeat for En, Es, Fr, De):**
    *   Set browser language -> Restart Chrome.
    *   **Shot 1 (Popup):** Capture the popup state (ensure "Enabled" text is localized).
    *   **Shot 2 (Options):** Capture `options.html` (ensure titles/labels are localized).
    *   **Shot 3 (Usage):** Capture a translation on a sample page (e.g., Wikipedia).
4.  **Output:** Store in `marketing/screenshots/{lang_code}/`.
5.  **Verify:** Check that the German screenshot actually shows German text, etc.
<!-- SECTION:PLAN:END -->
