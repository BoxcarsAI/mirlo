---
id: TASK-19
title: Migrate Extension to WXT Framework
status: Done
assignee:
  - '@claude'
created_date: '2026-03-20 14:39'
updated_date: '2026-03-20 15:04'
labels:
  - dev
milestone: Toucan Parity
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Migrate the vanilla Chrome extension to WXT (wxt.dev). This gives us: test infrastructure (Vitest + fake browser APIs), HMR dev experience, shadow DOM helpers for content script UI, and auto-generated manifest. Migration is mechanical — file structure maps cleanly. See docs/START_HERE.md for current architecture.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 WXT project scaffolded with all existing entrypoints (content, popup, options)
- [x] #2 All _locales moved to public/_locales and working
- [x] #3 All assets (icons, SVG) moved and referenced correctly
- [x] #4 manifest.json auto-generated matches current permissions and config
- [x] #5 Extension loads and works identically to current vanilla version
- [x] #6 zip-src.sh replaced with WXT build command
- [x] #7 Old src/ structure removed, WXT structure is the new source of truth
- [x] #8 All JS files converted to TypeScript during migration
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Scaffold WXT project (wxt.config.ts, package.json, tsconfig.json)
2. Create entrypoints: content/index.ts, popup/index.html+main.ts, options/index.html+main.ts
3. Move _locales to public/_locales, assets to public/assets
4. Convert all JS to TypeScript
5. Configure wxt.config.ts to match current manifest (permissions, icons, i18n)
6. Verify build produces correct manifest
7. Remove old src/ structure
8. Update .gitignore and zip-src.sh replacement
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Migrated vanilla Chrome extension to WXT framework.

Changes:
- Scaffolded WXT project with wxt.config.ts, package.json, tsconfig.json
- Created entrypoints: content/index.ts, popup/(index.html+main.ts), options/(index.html+main.ts)
- Moved _locales to public/_locales, assets to public/assets, SVG to public/
- Converted all JS files to TypeScript with proper type annotations
- Auto-generated manifest matches original permissions, icons, i18n, and options_ui config
- Removed old src/ flat structure and scripts/zip-src.sh (replaced by `npm run zip`)
- Updated .gitignore for node_modules, .output, .wxt

Build: `npm run build` produces .output/chrome-mv3/ ready to load in Chrome.
Dev: `npm run dev` for HMR development.
Zip: `npm run zip` replaces the old zip-src.sh script.
<!-- SECTION:FINAL_SUMMARY:END -->
