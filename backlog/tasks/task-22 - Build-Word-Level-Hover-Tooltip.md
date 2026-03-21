---
id: TASK-22
title: Build Word-Level Hover Tooltip
status: In Progress
assignee:
  - '@claude'
created_date: '2026-03-20 14:39'
updated_date: '2026-03-21 08:35'
labels:
  - dev
milestone: Toucan Parity
dependencies:
  - TASK-21
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
When user hovers a replaced word, show a tooltip with: the original word and the translation. Use WXT shadow DOM helpers to isolate tooltip styles from page CSS. Keep it minimal — no audio, no save button yet.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Hovering a replaced word shows tooltip with original word
- [ ] #2 Tooltip styled independently from page CSS (shadow DOM)
- [ ] #3 Tooltip dismisses on mouse-out
- [ ] #4 Tooltip works across different site layouts without breaking page
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Approach (revised after review)

### Key decisions:
- Single shadow DOM host element for style isolation (AC#2), repositioned per word
- Event delegation (one document listener) instead of per-element handlers
- Remove title attribute from translated words (conflicts with custom tooltip)

### Implementation:
1. **Word tooltip module** (src/utils/word-tooltip.ts)
   - ensureWordTooltip() — creates a single div with attachShadow, injects tooltip styles
   - showWordTooltip(span) — reads data-mirlo-original, positions near word, shows
   - hideWordTooltip() — hides with delay (120ms, cancelable)
   - positionWordTooltip(span, tooltip) — below word, flip above if near bottom of viewport

2. **CSS inside shadow DOM**
   - Compact pill: original word + arrow + translated word
   - Subtle shadow + border for visual separation
   - Transition for show/hide

3. **Content script integration**
   - Add document-level mouseover/mouseout delegation for .mirlo-word-translated
   - Wire into activateMirlo() alongside existing paragraph hover

4. **Clean up title attribute**
   - Remove title from replaceWord() in word-replacement.ts
   - Update tests accordingly

5. **Tests**
   - Tooltip creation (shadow root exists)
   - Content updates (original + translated shown)
   - Show/hide lifecycle
<!-- SECTION:PLAN:END -->
