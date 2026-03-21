---
id: TASK-12
title: >-
  Fix Translation Target Language When Content Language Differs From Page
  Language
status: Done
assignee:
  - '@claude'
created_date: '2026-03-20 00:00'
updated_date: '2026-03-21 16:22'
labels:
  - dev
  - bug
milestone: Toucan Parity
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When a user visits an English-language website (e.g., Reddit) and encounters content written in a different language (e.g., Spanish text in r/Granada), clicking translate produces the wrong result — the text gets "translated" into the same language it's already written in (Spanish → Spanish) instead of into English.

**Root cause:** `getLanguagePairForPage()` in `content.js` (lines 155-165) determines the source/target language pair using only the page's HTML `lang` attribute. On Reddit, `<html lang="en">` means the extension assumes all content is English and sets the target language to the user's learning language (Spanish). When the actual content is already Spanish, the translation is a no-op or produces garbled output.

The ML-based language detection infrastructure already exists in `getPageLanguageInfo()` (which uses the `LanguageDetector` API), but it's only used to populate the popup UI — it's never consulted during the actual translation flow in `translateParagraph()`.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Before translating, detect the actual language of the selected text (not the page's HTML lang attribute)
- [x] #2 If the detected content language matches the target language, flip the translation direction (translate into the user's other configured language instead)
- [x] #3 Handle mixed-language pages gracefully — different paragraphs on the same page may be in different languages
- [x] #4 Reuse the existing `LanguageDetector` API infrastructure from `getPageLanguageInfo()` rather than adding a new detection mechanism
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
TDD approach.

1. Add getLanguagePairForText(text, native, learning, detector) to translation.ts
   - Detects actual language of the text using LanguageDetector API
   - If detected language == native → translate to learning
   - If detected language == learning → translate to native
   - If neither → return null
   - Falls back to page-level detection if detector unavailable

2. Tests first:
   - Detected language matches native → source=native, target=learning
   - Detected language matches learning → source=learning, target=native
   - Detected language matches neither → null
   - Fallback to page language when detector unavailable
   - Low confidence detection → fall back to page language

3. Wire into content script:
   - translateParagraph() uses per-paragraph detection
   - translateWordsInParagraphViaApi() uses per-paragraph detection
   - Cache detector instance (create once, reuse)

4. Update existing tests
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added getLanguagePairForText() with LanguageDetector API
- Per-paragraph detection in both word and paragraph translation flows
- Cached detector instance + cached translators per language pair
- Falls back to page-level detection when detector unavailable or low confidence
- Min confidence threshold: 0.5
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Fixed translation direction for mixed-language pages by detecting actual paragraph language.

Changes:
- `src/utils/translation.ts` — added `getLanguagePairForText(text, native, learning, detector)` using Chrome LanguageDetector API. Returns correct source/target pair based on detected language. Min confidence 0.5, min text length 10 chars.
- `src/entrypoints/content/index.ts` — per-paragraph language detection in both `translateWordsOnPage` and `translateParagraph`. Cached detector instance and translator-per-language-pair cache. Falls back to page `lang` attribute when detector unavailable.

Tests: 167 total (8 new), all passing. TDD: tests written and failing before implementation.
<!-- SECTION:FINAL_SUMMARY:END -->

## Notes

Reproduces on any site where `<html lang>` doesn't match the actual content language — common on social media, forums, and user-generated content sites.
