---
id: TASK-21
title: Implement Word Segmentation and Single-Word Translation
status: To Do
assignee: []
created_date: '2026-03-20 14:39'
labels:
  - dev
dependencies:
  - TASK-20
priority: high
milestone: Toucan Parity
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Core feature: replace individual words in paragraphs with target-language translations while preserving DOM structure. Key challenge: Chrome Translator API works on text blocks, not individual words. Spike needed first to determine approach — translate words individually vs translate sentence and reverse-align. Must handle nested HTML (spans, links, bold) without breaking page layout.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Words within paragraphs can be individually replaced with translated equivalents
- [ ] #2 Nested HTML elements (links, bold, spans) preserved during word replacement
- [ ] #3 Replaced words visually distinguished from surrounding text
- [ ] #4 Original word recoverable on hover/click
- [ ] #5 Paragraph translation mode still works alongside word mode
- [ ] #6 Unit tests cover word segmentation and DOM reconstruction
<!-- AC:END -->
