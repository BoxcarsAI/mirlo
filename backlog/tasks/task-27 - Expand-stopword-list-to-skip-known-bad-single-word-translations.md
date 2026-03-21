---
id: TASK-27
title: Expand stopword list to skip known-bad single-word translations
status: Done
assignee:
  - '@claude'
created_date: '2026-03-21 17:00'
updated_date: '2026-03-21 17:04'
labels:
  - dev
dependencies: []
references:
  - spikes/batch-vs-individual-translation.js
  - >-
    backlog/decisions/decision-1 -
    Batch-vs-Individual-Word-Translation-Strategy.md
  - src/utils/word-replacement.ts
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Chrome Translator API mistranslates common words when sent individually — modal verbs become nonsense ("cannot"→"porque"), gerunds become nouns ("running"→"funcionamiento"). See decision-1 for the full spike data.

Rather than building batch-with-fallback complexity, skip these words entirely. A missing translation is better than a wrong one.

The current stopword list in `src/utils/word-replacement.ts` already covers some modal verbs but misses gerunds and other problem patterns identified in the spike.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Gerunds (-ing words that translate as nouns) added to stopword list
- [x] #2 Remaining modal verbs not already covered added to stopword list
- [x] #3 Spike script re-run to verify problem words are now skipped
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
TDD approach:

1. Write failing tests for gerunds and problem words in collectTranslatableWords
2. Add words to STOPWORDS set
3. Run full suite to verify no regressions
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added 10 gerunds to STOPWORDS: running, eating, thinking, playing, writing, building, learning, reading, speaking, working
- Existing "buildings" test still passes (plural form not matched by singular stopword)
- Test-first: wrote failing test, added words, 168/168 passing
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Expanded the stopword list to skip words the Chrome Translator API mistranslates when sent individually.

Changes:
- `src/utils/word-replacement.ts` — added 10 gerunds to STOPWORDS (running, eating, thinking, playing, writing, building, learning, reading, speaking, working). These get noun-ified by the API: "running"→"funcionamiento", "building"→"edificio".
- `src/__tests__/word-replacement.test.ts` — added test asserting all 10 gerunds are excluded by collectTranslatableWords.

The existing modal verbs (would, could, should, might, cannot) were already in the stopword list. Combined, all 15 problem words identified in the batch-vs-individual spike (decision-1) are now blocked.

Tests: 168 passed, 0 failed.
<!-- SECTION:FINAL_SUMMARY:END -->
