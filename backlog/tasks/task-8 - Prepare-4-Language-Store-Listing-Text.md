---
id: TASK-8
title: Prepare 4-Language Store Listing Text
status: Done
assignee: []
created_date: '2026-01-29 19:56'
updated_date: '2026-01-29 20:23'
labels: []
milestone: GA - i18n Launch (Core 4)
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Prepare the text for the Chrome Web Store listing in all 4 target languages.

**Implementation Strategy:**
1.  **Extract Master Copy:** Create `marketing/store-copy.md` containing the English store listing text (Summary + Detailed Description).
2.  **Create Translations:** Create separate markdown files for each target language:
    *   `marketing/store-copy.es.md` (Spanish)
    *   `marketing/store-copy.fr.md` (French)
    *   `marketing/store-copy.de.md` (German)
3.  **Content Requirements:**
    *   Ensure all formatting (bullet points, headers, emojis) is preserved.
    *   Verify character limits for the "Summary" section (132 chars) in all languages.
    *   Ensure "What Makes Mirlo Different" and "Privacy Promise" sections are accurately translated to maintain the brand voice.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Localized descriptions for English, Spanish, French, and German are ready for the store.
- [ ] #2 Each description is optimized with relevant keywords for that language's market.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
**Plan:**
1.  **Source:** Use `marketing/store-copy.md` as the source of truth.
2.  **Spanish:** Create `marketing/store-copy.es.md`.
    *   *Tone:* Direct, professional but accessible.
    *   *Check:* Summary length < 132 chars.
3.  **French:** Create `marketing/store-copy.fr.md`.
    *   *Tone:* Formal but modern ("vous" address).
    *   *Check:* Summary length < 132 chars.
4.  **German:** Create `marketing/store-copy.de.md`.
    *   *Tone:* Trustworthy, precise ("Sie" address).
    *   *Check:* Summary length < 132 chars (Critical for German due to compound words).
5.  **Validation:** Review all 4 files for formatting consistency.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Successfully created localized store listing text for all 4 supported languages.

Files:
- `marketing/store-copy.md` (English)
- `marketing/store-copy.es.md` (Spanish)
- `marketing/store-copy.fr.md` (French)
- `marketing/store-copy.de.md` (German)

All files follow the required structure and respect character limits for the store summary.
<!-- SECTION:FINAL_SUMMARY:END -->
