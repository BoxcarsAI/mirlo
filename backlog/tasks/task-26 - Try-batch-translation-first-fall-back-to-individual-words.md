---
id: TASK-26
title: 'Try batch translation first, fall back to individual words'
status: To Do
assignee: []
created_date: '2026-03-21 09:15'
labels:
  - dev
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The pipe-delimited batch approach gives better translations (e.g. 'cannot'→'no puede') because surrounding words provide context. But pipe counts sometimes don't match. Strategy: try batch first, if pipe count matches use it, otherwise fall back to individual word translation. This improves quality for modal verbs and ambiguous words.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Batch-first translation with individual fallback implemented
- [ ] #2 Tests cover both batch success and fallback scenarios
<!-- AC:END -->
