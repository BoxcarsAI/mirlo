# Mirlo Development Guide

Welcome to Mirlo. This guide covers the technical setup and how to contribute.

## What Mirlo Does

Mirlo replaces words on web pages with translations in your target language. It uses Chrome's built-in Translator API — everything runs locally, no external APIs. Users control which sites are active and how many words get translated (density control).

Two translation modes:
- **Word mode** (automatic): individual words are replaced inline with hover tooltips showing the original
- **Paragraph mode** (on click): full paragraph translation via the Mirlo badge

## Tech Stack

- **WXT** — framework for building Chrome extensions with HMR and TypeScript
- **TypeScript** — all source code
- **Vitest** — unit tests with happy-dom for DOM testing
- **Chrome Translator API** — on-device translation (no cloud calls)
- **Chrome LanguageDetector API** — per-paragraph language detection

## Project Structure

```
src/
  entrypoints/         — WXT entrypoints
    content/           — Content script (word replacement, paragraph translation, tooltips)
    popup/             — Toolbar popup (status, quick actions)
    options/           — Settings page (languages, density control)
  utils/               — Shared modules
    word-replacement.ts    — Word selection, stopword filtering, translation map
    word-segmentation.ts   — Splitting paragraphs into individual word spans
    word-tooltip.ts        — Shadow DOM hover tooltip for translated words
    translation.ts         — Language pair resolution, per-paragraph detection
    article-detection.ts   — Heuristic for article-like pages
    paragraph-filter.ts    — Paragraph eligibility checks
    domains.ts             — Domain normalization
    language.ts            — Language name lookup
    storage-keys.ts        — Chrome storage key constants
  __tests__/           — Vitest unit tests
    fixtures/          — Test HTML fixtures
public/
  _locales/            — Chrome i18n messages (en, es, fr, de)
  icons/               — Extension icons
wxt.config.ts          — WXT and manifest configuration
```

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (HMR — changes reload automatically)
npm run dev

# Run tests
npm test

# Production build
npm run build

# Create distributable zip
npm run zip
```

No manual reloading at `chrome://extensions` during development — WXT handles it.

## Loading the Dev Build

1. Run `npm run dev`
2. Open `chrome://extensions`, enable Developer mode
3. Click "Load unpacked" and select the `.output/chrome-mv3-dev/` directory
4. WXT will hot-reload on file changes

## Supported Languages

English, Spanish, French, German. These are the languages with reliable Chrome Translator API support.

## Localization

UI strings live in `public/_locales/{lang}/messages.json`. To add a new string:
1. Add the key to `public/_locales/en/messages.json`
2. Add translations to es, fr, de message files
3. Use `chrome.i18n.getMessage("keyName")` in TypeScript or `data-i18n="keyName"` in HTML

## Quality Standards

- **Privacy first**: No external API calls, no tracking, no data collection
- **Local AI only**: All translation via Chrome's built-in Translator API
- **Test what you build**: Add tests for new logic in `src/__tests__/`
- **Performance**: Keep the content script lightweight
