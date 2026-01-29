---
id: TASK-1
title: I18n Infrastructure & Manifest Update
status: Done
assignee: []
created_date: '2026-01-29 15:32'
updated_date: '2026-01-29 15:33'
labels: []
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Initialize the `_locales` directory structure and update `manifest.json` to support internationalization. This is the foundation for all future translation work.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 _locales/en/messages.json exists and is valid JSON
- [x] #2 manifest.json contains "default_locale": "en"
- [x] #3 Manifest "name", "description", and "action.default_title" are replaced with __MSG_...__ placeholders
- [x] #4 Extension loads in Chrome without errors
- [x] #5 Extension details in Chrome://extensions show the correct English text
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Verify `src/manifest.json` location and content.
2. Create directory `src/_locales/en`.
3. Create `src/_locales/en/messages.json` with keys: `appName`, `appDesc`, `actionTitle`.
4. Update `src/manifest.json` to add `"default_locale": "en"` and use `__MSG_key__` placeholders.
5. Verify syntax using `cat` and manual inspection.
<!-- SECTION:PLAN:END -->
