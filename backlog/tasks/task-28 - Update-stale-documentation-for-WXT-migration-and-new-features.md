---
id: TASK-28
title: Update stale documentation for WXT migration and new features
status: Done
assignee:
  - '@claude'
created_date: '2026-03-21 17:11'
updated_date: '2026-03-21 17:13'
labels:
  - docs
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Multiple docs are outdated after the WXT migration (TASK-19) and Toucan parity features (TASK-21/22/23/12/27). Developer onboarding guide references plain JS files that no longer exist. Feature descriptions miss word-level translation, hover tooltips, density control, and per-paragraph language detection.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 START_HERE.md rewritten for WXT/TypeScript workflow
- [x] #2 code-snippets.md deleted or rewritten with current patterns
- [x] #3 mission.md current state updated to reflect Toucan parity progress
- [x] #4 INSTALL.md updated with word-hover tooltip feature
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Rewrite START_HERE.md — WXT framework, TypeScript, npm run dev, project structure, test workflow
2. Delete code-snippets.md — all examples are wrong, not worth salvaging
3. Update mission.md current state — document shipped Toucan parity features
4. Update INSTALL.md — add word-hover tooltip, density control to feature description
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Updated all stale documentation for WXT migration and Toucan parity features.

Changes:
- `docs/START_HERE.md` — full rewrite: WXT framework, TypeScript, project structure, dev workflow with HMR
- `docs/code-snippets.md` — deleted (all examples were pre-WXT plain JS, none compiled)
- `docs/INSTALL.md` — rewritten with word-hover tooltips, density control, Chrome Web Store link, Translator API prerequisites
- `mission.md` — updated current state with shipped Toucan parity features (word translation, tooltips, density, language detection, stopwords)
<!-- SECTION:FINAL_SUMMARY:END -->
