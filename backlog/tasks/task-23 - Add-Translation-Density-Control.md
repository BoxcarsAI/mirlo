---
id: TASK-23
title: Add Translation Density Control
status: To Do
assignee: []
created_date: '2026-03-20 14:39'
labels:
  - dev
dependencies:
  - TASK-22
priority: medium
milestone: Toucan Parity
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Let users control how many words get replaced per page: Low (5-10%), Medium (20-30%), High (50%+). Setting lives in extension options page alongside existing language preferences. Density preference persisted in chrome.storage.sync.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Options page has density control (Low / Medium / High)
- [ ] #2 Density setting persisted in chrome.storage.sync
- [ ] #3 Content script respects density setting when replacing words
- [ ] #4 Changing density takes effect on next page load
<!-- AC:END -->
