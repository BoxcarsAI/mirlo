---
id: TASK-20
title: Add Test Coverage for Existing Paragraph Translation
status: Done
assignee:
  - '@claude'
created_date: '2026-03-20 14:39'
updated_date: '2026-03-20 15:25'
labels:
  - dev
milestone: Toucan Parity
dependencies:
  - TASK-19
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Using Vitest and WXT's fake-browser, add unit tests covering the existing paragraph translation flow: article detection heuristics, paragraph eligibility filtering, translation API interaction, and tooltip rendering. This is the safety net before we refactor content.js for word-level translation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Vitest configured and running via WXT
- [x] #2 Article detection heuristics tested (og:type, schema.org, URL patterns, paragraph count)
- [x] #3 Paragraph eligibility filtering tested (visibility, skip containers, word count)
- [x] #4 Translation flow tested with fake Translator API
- [x] #5 All tests pass in CI-compatible way (headless)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Extract pure functions into testable modules (minimal refactoring, no behavior change):
   - src/utils/article-detection.ts — hasOgArticleMeta, hasArticleSchema, urlLooksLikeArticle, hasParagraphHeuristic, isArticleLike
   - src/utils/paragraph-filter.ts — isVisibleElement, isEligibleParagraph, getParagraphText
   - src/utils/translation.ts — getLanguagePairForPage, getNormalizedPageLanguage, getHtmlLanguage
   Content script imports from these modules instead of defining inline.

2. Write tests:
   - src/__tests__/article-detection.test.ts — AC#2: og:type, schema.org, URL patterns, paragraph count heuristic
   - src/__tests__/paragraph-filter.test.ts — AC#3: visibility, skip containers, word count
   - src/__tests__/translation.test.ts — AC#4: language pair logic, fake Translator API interaction

3. Verify vitest config works (AC#1) and all tests pass headless (AC#5)

4. Run full test suite to confirm no regressions
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Extracted pure functions into 3 testable modules: article-detection.ts, paragraph-filter.ts, translation.ts
- Content script updated to import from these modules (no behavior change)
- Installed happy-dom for DOM testing environment
- Wrote 48 new tests across 3 test files
- All 88 tests pass (48 new + 40 existing), build succeeds
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Extracted testable logic from content script into three utility modules and added comprehensive unit tests.

Changes:
- Created `src/utils/article-detection.ts` — article detection heuristics (og:type, schema.org, URL patterns, paragraph count, visibility checks)
- Created `src/utils/paragraph-filter.ts` — paragraph eligibility filtering (text extraction, word count, skip containers)
- Created `src/utils/translation.ts` — language pair resolution (HTML lang detection, normalization, pair matching)
- Updated `src/entrypoints/content/index.ts` to import from these modules instead of defining inline
- Added `happy-dom` dev dependency for DOM test environment
- Added 3 test files: article-detection.test.ts, paragraph-filter.test.ts, translation.test.ts

Tests: 88 total (48 new + 40 existing), all passing. Build verified.
<!-- SECTION:FINAL_SUMMARY:END -->
