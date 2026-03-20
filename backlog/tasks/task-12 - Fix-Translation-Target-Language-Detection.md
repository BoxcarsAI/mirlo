---
id: TASK-12
title: Fix Translation Target Language When Content Language Differs From Page Language
status: To Do
assignee: []
created_date: '2026-03-20 00:00'
updated_date: '2026-03-20 00:00'
labels: [dev, bug]
milestone: Go Public
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
- [ ] #1 Before translating, detect the actual language of the selected text (not the page's HTML lang attribute)
- [ ] #2 If the detected content language matches the target language, flip the translation direction (translate into the user's other configured language instead)
- [ ] #3 Handle mixed-language pages gracefully — different paragraphs on the same page may be in different languages
- [ ] #4 Reuse the existing `LanguageDetector` API infrastructure from `getPageLanguageInfo()` rather than adding a new detection mechanism
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
**Plan:**

1. **Modify `translateParagraph()`** (content.js ~line 459): Before calling the Translator API, run `LanguageDetector.detect()` on the paragraph text to determine its actual language.

2. **Add content-aware language pair resolution**: Create a new function (e.g., `getLanguagePairForContent(detectedLang)`) that:
   - Takes the detected content language as input
   - Returns the correct source/target pair based on the user's native and learning languages
   - Falls back to `getLanguagePairForPage()` if detection confidence is low

3. **Key code locations:**
   - `getLanguagePairForPage()` — lines 155-165 (current logic, page-level only)
   - `getPageLanguageInfo()` — lines 97-147 (has ML detection, currently unused in translate flow)
   - `translateParagraph()` — lines 440-505 (needs to call content detection before translating)

4. **Edge cases to handle:**
   - Detection confidence below threshold → fall back to page language
   - Content language is neither the user's native nor learning language → may need to surface an error or pick the best target
   - Very short text where detection is unreliable
<!-- SECTION:PLAN:END -->

## Notes

Reproduces on any site where `<html lang>` doesn't match the actual content language — common on social media, forums, and user-generated content sites.
