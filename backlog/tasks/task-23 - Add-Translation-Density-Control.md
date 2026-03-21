---
id: TASK-23
title: Add Translation Density Control
status: Done
assignee:
  - '@claude'
created_date: '2026-03-20 14:39'
updated_date: '2026-03-21 09:21'
labels:
  - dev
milestone: Toucan Parity
dependencies:
  - TASK-22
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let users control how many words get replaced per page: Low (5-10%), Medium (20-30%), High (50%+). Setting lives in extension options page alongside existing language preferences. Density preference persisted in chrome.storage.sync.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Options page has density control (Low / Medium / High)
- [x] #2 Density setting persisted in chrome.storage.sync
- [x] #3 Content script respects density setting when replacing words
- [x] #4 Changing density takes effect on next page load
- [x] #5 Words translated at most once per paragraph (no duplicate replacements)
- [x] #6 Common function words (articles, prepositions, conjunctions) excluded from translation
- [x] #7 Short words (< 5 chars) excluded from translation
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
TDD approach — tests first.

1. Add storage key for density
2. Write tests for word selection with density (src/__tests__/word-replacement.test.ts)
   - selectWordsForTranslation(words, "low") returns ~5-10% of words
   - selectWordsForTranslation(words, "medium") returns ~20-30%
   - selectWordsForTranslation(words, "high") returns ~50%+
   - Edge cases: empty list, single word, density defaults to medium
3. Implement selectWordsForTranslation in word-replacement.ts
4. Wire into content script (read density from storage, pass to translation flow)
5. Add density control to options page HTML + main.ts
6. Tests for storage integration
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Found two quality issues during testing:
1. Same word translated multiple times in a paragraph (e.g. "the" appears 8x, all get translated)
2. Simple function words (the, and, was, for) are not useful to translate — need stopword filter + min length

Adding ACs and fixing in this task.

- Min word length raised from 3 to 5 chars
- Added stopword set (~50 common function words: articles, prepositions, conjunctions, modals)
- replaceWordsInParagraph now tracks replaced words, only replaces first occurrence
- TDD: wrote 5 failing tests first, then implemented to pass
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added translation density control and word quality filtering.

Changes:
- `src/utils/storage-keys.ts` — added translationDensity key + TranslationDensity type
- `src/utils/word-replacement.ts` — selectWordsForTranslation (density-based subsampling), stopword filter (~50 function words), min length 5 chars, first-occurrence-only replacement
- `src/entrypoints/content/index.ts` — reads density from storage, applies to word selection
- `src/entrypoints/options/` — density dropdown (Low/Medium/High) in options page
- `src/__tests__/fixtures/paragraphs.ts` — added REPEATED_WORDS and MIXED_COMPLEXITY fixtures

Tests: 159 total, all passing. TDD approach: tests written before implementation for all new behavior.
<!-- SECTION:FINAL_SUMMARY:END -->
