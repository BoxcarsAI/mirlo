---
id: TASK-25
title: Report Chrome Translator API single-word translation bugs to Google
status: To Do
assignee: []
created_date: '2026-03-21 09:15'
labels:
  - dev
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Chrome Translator API produces incorrect translations for many common English words when translated individually (without sentence context). Modal verbs are particularly affected: 'cannot'→'porque', 'can'→'lata', 'may'→'mayo', 'will'→'voluntad'. The API treats isolated words as nouns/literals rather than their most common usage. File a bug report with Google including test cases and comparison to sentence-level results.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Bug report filed with Google (Chromium bug tracker)
- [ ] #2 Test cases documented with individual vs sentence-level comparison
<!-- AC:END -->
