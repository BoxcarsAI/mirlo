---
id: TASK-10
title: Update Documentation for 4-Language Support
status: To Do
assignee: []
created_date: '2026-01-29 20:11'
updated_date: '2026-01-29 20:14'
labels: []
milestone: GA - i18n Launch (Core 4)
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Update the project documentation to reflect the new language support added in the GA release.

Key files to check:
- README.md
- docs/INSTALL.md
- docs/START_HERE.md
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 README.md lists English, Spanish, French, and German as supported languages.
- [ ] #2 docs/INSTALL.md instructions are verified to be language-neutral or cover the new locales.
- [ ] #3 Any other user-facing markdown files are checked for language accuracy.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
**Plan:**
1.  **README.md:**
    *   Update the "Quick Start" to be more descriptive.
    *   Add a "Features" section highlighting Privacy and the 4 supported languages.
    *   Replace the legacy description with the new "Privacy-first" tagline.
2.  **docs/INSTALL.md:**
    *   Rewrite "What to Expect" to describe the actual functionality (click-to-translate paragraphs).
    *   Remove outdated references to "highlighting the word 'the'".
3.  **Verification:**
    *   Preview markdown rendering to ensure links and formatting are correct.
<!-- SECTION:PLAN:END -->
