---
id: TASK-21
title: Implement Word Segmentation and Single-Word Translation
status: Done
assignee:
  - '@claude'
created_date: '2026-03-20 14:39'
updated_date: '2026-03-21 08:12'
labels:
  - dev
milestone: Toucan Parity
dependencies:
  - TASK-20
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core feature: replace individual words in paragraphs with target-language translations while preserving DOM structure. Key challenge: Chrome Translator API works on text blocks, not individual words. Spike needed first to determine approach — translate words individually vs translate sentence and reverse-align. Must handle nested HTML (spans, links, bold) without breaking page layout.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Words within paragraphs can be individually replaced with translated equivalents
- [x] #2 Nested HTML elements (links, bold, spans) preserved during word replacement
- [x] #3 Replaced words visually distinguished from surrounding text
- [x] #4 Original word recoverable on hover/click
- [x] #5 Paragraph translation mode still works alongside word mode
- [x] #6 Unit tests cover word segmentation and DOM reconstruction
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
Spike complete. Strategy: individual word translation via pipe-delimited batch.

## TDD Implementation

### Step 1: Fixtures
Create src/__tests__/fixtures/paragraphs.ts with realistic HTML:
- Plain text paragraph
- Paragraph with nested bold/italic/links
- Paragraph with deeply nested spans
- Edge cases: single word, punctuation

### Step 2: Word segmentation module (src/utils/word-segmentation.ts)
Tests first (src/__tests__/word-segmentation.test.ts), then implement:
- segmentTextNode(textNode) — split a text node into word spans + whitespace
- segmentParagraph(paragraph) — walk all text nodes, wrap words in <span class="mirlo-word" data-mirlo-original="word">
- Must preserve parent DOM structure (text inside <strong> stays inside <strong>)
- Must handle punctuation attached to words
- Must be idempotent (skip already-segmented paragraphs)

### Step 3: Word replacement module (src/utils/word-replacement.ts)
Tests first (src/__tests__/word-replacement.test.ts), then implement:
- replaceWord(span, translatedText) — swap text, add .mirlo-word-translated class, set title attr to original
- revertWord(span) — restore original text, remove class
- translateWordsInParagraph(paragraph, translator, languagePair) — select words, batch via pipe-delimited, apply translations
- revertWordsInParagraph(paragraph) — clear all word translations (used when paragraph mode activates)

### Step 4: CSS for translated words
- .mirlo-word-translated: subtle visual distinction (use frontend-design skill)

### Step 5: Content script integration
- On activation, auto-translate words in eligible paragraphs
- Badge click: revertWordsInParagraph() then translateParagraph() (existing flow)
- Paragraph revert: re-translate words if word mode active

### Step 6: Verify all ACs pass
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Spike Results (2026-03-21)
Strategy: Individual word translation via pipe-delimited batch.
- Single words: accurate, fast (0-11ms)
- Batch: pipe-delimited format (word|word|word) preserves structure, parses back cleanly
- Context: ambiguous words get default meaning (acceptable for v1, same as Toucan)
- Sentence alignment: not viable (word counts differ across languages)

## Design Decisions
- AC#3: Subtle but clear visual distinction (use frontend-design skill for polish)
- AC#4: Basic plumbing only — store original in data attr, simple title hover. Full tooltip is TASK-22.
- AC#5: Word translations are automatic (appear on page load for enabled domains). Paragraph mode is manual (click bird badge). Clicking badge clears any translated words in that paragraph first, then shows full paragraph translation.
- Translation approach: pipe-delimited batch in one API call per paragraph

- Implemented word segmentation (word-segmentation.ts) and replacement (word-replacement.ts)
- Pipe-delimited batch translation via Translator API
- CSS: teal text color + dotted underline + hover background tint
- Content script: auto-translates words on activation, clears them on paragraph mode
- 30 new tests (segmentation, replacement, clear-before-paragraph)
- 118 total tests passing, build succeeds
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented Toucan-style word-level translation alongside existing paragraph translation mode.

## Spike
Tested Chrome Translator API via DevTools MCP on elpais.com. Individual word translation is fast (0-11ms), accurate for unambiguous words, and supports pipe-delimited batching for single API calls.

## Changes
- **src/utils/word-segmentation.ts** — `segmentParagraph()` walks text nodes and wraps each word in `<span class="mirlo-word">` while preserving nested HTML (links, bold, spans). Skips mirlo-badge content. Idempotent.
- **src/utils/word-replacement.ts** — `replaceWord()`, `revertWord()`, `replaceWordsInParagraph()`, `revertWordsInParagraph()` for swapping word text with translations and reverting.
- **src/entrypoints/content/index.ts** — `translateWordsOnPage()` auto-translates words in eligible paragraphs on activation. Badge click (paragraph mode) calls `revertWordsInParagraph()` first to clear word translations. Words >2 chars matching alpha pattern are translated; same-translation words are skipped.
- **src/entrypoints/content/style.css** — `.mirlo-word-translated`: teal text, dotted underline, hover background tint.
- **src/__tests__/fixtures/paragraphs.ts** — HTML fixtures for testing.
- **src/__tests__/word-segmentation.test.ts** — 16 tests for DOM segmentation.
- **src/__tests__/word-replacement.test.ts** — 14 tests for replacement and paragraph-mode clearing.

## Tests
118 total (30 new), all passing. Build verified.
<!-- SECTION:FINAL_SUMMARY:END -->
