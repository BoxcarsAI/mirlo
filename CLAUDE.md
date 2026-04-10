# Mirlo

Privacy-first language learning Chrome extension. Replaces words on web pages with translations using Chrome's built-in Translator API. Everything runs on-device.

## Project Structure

```
src/
  entrypoints/    — WXT entrypoints (content/, popup/, options/)
  utils/          — Shared modules (domains, language, i18n, storage-keys)
  __tests__/      — Vitest unit tests
public/           — Static assets (_locales, icons, SVG)
docs/             — Developer guides
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
