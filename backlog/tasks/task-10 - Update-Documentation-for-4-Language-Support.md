---
id: TASK-10
title: Update Documentation for 4-Language Support
status: Done
assignee: []
created_date: '2026-01-29 20:11'
updated_date: '2026-01-29 20:28'
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
1.  **README.md Rewrite:**
    *   Header: Mirlo - Privacy-first language learning.
    *   Description: Use the GA marketing copy ("Read real content...").
    *   Features: 100% Private, Local AI, Paragraph Translation, Open Source.
    *   Supported Languages: List En, Es, Fr, De with flag emojis.
    *   Quick Start: 3-step installation guide.
2.  **docs/INSTALL.md Update:**
    *   Remove legacy references to "highlighting 'the'".
    *   Describe the actual usage: click the bird badge on a paragraph.
    *   Update troubleshooting for current extension structure.
3.  **docs/START_HERE.md Update:**
    *   Remove the "Options Page Project" specific branding.
    *   Repurpose as a general "Development Guide".
    *   Ensure language list matches GA (En, Es, Fr, De).
4.  **Verification:**
    *   Check all internal links between docs.
    *   Verify markdown rendering.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Successfully updated project documentation for the GA release.

Changes:
1.  **README.md**: Completely updated with the new "Privacy-first" branding, paragraph translation feature, and the list of 4 supported languages (En, Es, Fr, De).
2.  **docs/INSTALL.md**: Rewritten to describe the actual paragraph translation usage and remove outdated references to word-level highlighting.
3.  **docs/START_HERE.md**: Repurposed as a general development guide for the project, reflecting the current architecture and language support.

All documents now accurately reflect the GA state of the extension.
<!-- SECTION:FINAL_SUMMARY:END -->
