# Background

Merlo (M-I-R-L-O) is a lightweight, privacy-first Chrome extension for language learning. The Phase 1 MVP validates the core mechanics: a Manifest V3 extension that injects a content script, scans visible text, and highlights a small set of words in-page. This proves the end-to-end pipeline (load unpacked → content script runs → DOM changes).

## Current MVP Behavior

- Highlights the first 5 occurrences of the word "the" on page load and on dynamic updates.
- Uses the CSS class `peli-can-highlight` for easy replacement with translation UI later.
- Popup displays an active status and a basic AI capability check.

## Why This Exists

- Provide immediate, local feedback that the extension is working.
- Establish a safe baseline before integrating any AI or network features.
- Keep the first release usable without sign-ups, accounts, or external APIs.

## Next Task: Chrome Built-in AI APIs

Goal: Probe Chrome’s built-in AI/translation APIs to confirm availability and behavior on supported versions (Chrome 138+ or Chrome versions with the feature enabled). We will not call external services.

### Questions to Answer

- Is the Translation API available in the current browser environment?
- What is the correct capability detection sequence and API surface?
- Can we translate a single word or short phrase locally?
- What are the failure modes when the API is unavailable?

### Expected Deliverables

- A minimal capability check utility in the extension.
- A small UI indicator that reflects AI availability accurately.
- A single controlled translation test (behind a flag or dev toggle).

## Scope Guardrails

- No account sign-ups, external APIs, or data collection.
- All processing should remain local to the browser.
- Keep the MVP small and reversible.

The mirlo bird svg is creative commons: https://creativecommons.org/publicdomain/zero/1.0/
and downloaded from: https://svgsilh.com/tag/blackbird-1.html