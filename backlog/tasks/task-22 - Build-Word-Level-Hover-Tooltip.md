---
id: TASK-22
title: Build Word-Level Hover Tooltip
status: To Do
assignee: []
created_date: '2026-03-20 14:39'
labels:
  - dev
dependencies:
  - TASK-21
priority: medium
milestone: Toucan Parity
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When user hovers a replaced word, show a tooltip with: the original word and the translation. Use WXT shadow DOM helpers to isolate tooltip styles from page CSS. Keep it minimal — no audio, no save button yet.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Hovering a replaced word shows tooltip with original word
- [ ] #2 Tooltip styled independently from page CSS (shadow DOM)
- [ ] #3 Tooltip dismisses on mouse-out
- [ ] #4 Tooltip works across different site layouts without breaking page
<!-- AC:END -->
