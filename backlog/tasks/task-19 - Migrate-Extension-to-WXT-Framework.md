---
id: TASK-19
title: Migrate Extension to WXT Framework
status: To Do
assignee: []
created_date: '2026-03-20 14:39'
labels:
  - dev
dependencies: []
priority: high
milestone: Toucan Parity
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Migrate the vanilla Chrome extension to WXT (wxt.dev). This gives us: test infrastructure (Vitest + fake browser APIs), HMR dev experience, shadow DOM helpers for content script UI, and auto-generated manifest. Migration is mechanical — file structure maps cleanly. See docs/START_HERE.md for current architecture.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 WXT project scaffolded with all existing entrypoints (content, popup, options)
- [ ] #2 All _locales moved to public/_locales and working
- [ ] #3 All assets (icons, SVG) moved and referenced correctly
- [ ] #4 manifest.json auto-generated matches current permissions and config
- [ ] #5 Extension loads and works identically to current vanilla version
- [ ] #6 zip-src.sh replaced with WXT build command
- [ ] #7 Old src/ structure removed, WXT structure is the new source of truth
<!-- AC:END -->
