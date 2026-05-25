# Mirlo

Privacy-first language learning Chrome extension. Replaces words on web pages with translations using Chrome's built-in Translator API. Everything runs on-device.

## Scope of this repo

**This is the public OSS code repo.** It holds the extension itself: source, tests, build config, the user-facing README, install/dev docs, and the locale message files that ship inside the build.

It does NOT hold marketing copy, competitive analysis, brand strategy, store-listing source-of-truth, screenshots, ICP descriptions, channel plans, ops directives, promote records, raw research, internal PRDs, or anything else operational. Those live in a separate internal repo. **If you're working on any of those, ask the user where to put it before writing — don't add it here.**

The user-facing `README.md` is the exception: it lives here because it's the public face of the project, and it's allowed to describe what Mirlo does to potential users. Treat it as code-adjacent documentation, not as marketing source-of-truth.

## Project Structure

```
src/
  entrypoints/    — WXT entrypoints (content/, popup/, options/)
  utils/          — Shared modules (domains, language, i18n, storage-keys)
  __tests__/      — Vitest unit tests
public/
  _locales/       — Chrome i18n message files (en, es, fr, de). Ship in the build.
  assets/         — Icon files (16/32/48/128)
docs/             — Developer guides (START_HERE, INSTALL)
```

## Dev Commands

- `npm run dev` — WXT dev server with HMR
- `npm run build` — Production build to `.output/chrome-mv3/`
- `npm test` — Run Vitest tests
- `npm run zip` — Create distributable zip

## Key Config

- `wxt.config.ts` — WXT/manifest configuration
- `tsconfig.json` — TypeScript config
- `vitest.config.ts` — Test runner config

## i18n notes

`public/_locales/{en,es,fr,de}/messages.json` are code artifacts — they ship in the extension build and are referenced by `chrome.i18n.getMessage()` in the source. Edit them when changing UI strings or the auto-localized store-listing fields (`appName`, `appDesc`). Anything *about* how to localize, why a string is worded a given way, or what the brand voice rules are belongs in the internal repo, not here.
