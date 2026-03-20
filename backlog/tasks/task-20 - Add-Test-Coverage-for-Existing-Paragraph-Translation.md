---
id: TASK-20
title: Add Test Coverage for Existing Paragraph Translation
status: To Do
assignee: []
created_date: '2026-03-20 14:39'
labels:
  - dev
dependencies:
  - TASK-19
priority: high
milestone: Toucan Parity
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Using Vitest and WXT's fake-browser, add unit tests covering the existing paragraph translation flow: article detection heuristics, paragraph eligibility filtering, translation API interaction, and tooltip rendering. This is the safety net before we refactor content.js for word-level translation.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Vitest configured and running via WXT
- [ ] #2 Article detection heuristics tested (og:type, schema.org, URL patterns, paragraph count)
- [ ] #3 Paragraph eligibility filtering tested (visibility, skip containers, word count)
- [ ] #4 Translation flow tested with fake Translator API
- [ ] #5 All tests pass in CI-compatible way (headless)
<!-- AC:END -->
