---
id: TASK-26
title: 'Try batch translation first, fall back to individual words'
status: Done
assignee: []
created_date: '2026-03-21 09:15'
updated_date: '2026-03-21 16:58'
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

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Closed — spike showed batch translation is not consistently better than individual. See decision-1 for data.

The spike tested 35 words both ways. Batch fixed 4 words but broke 3 others (including returning empty string for "would"). Capitalization normalization adds complexity for marginal gain.

Instead of batch-first-with-fallback, we will expand the stopword list to skip known-bad words and report the underlying API bug to Google (TASK-25).
<!-- SECTION:FINAL_SUMMARY:END -->
