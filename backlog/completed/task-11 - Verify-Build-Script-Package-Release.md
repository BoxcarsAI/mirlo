---
id: TASK-11
title: Verify Build Script & Package Release
status: Done
assignee: []
created_date: '2026-01-29 20:11'
updated_date: '2026-01-29 20:30'
labels: []
milestone: GA - i18n Launch (Core 4)
dependencies: []
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Verify that the build/packaging script correctly includes the new locale folders and create the final release artifact.

Steps:
1. Review `scripts/zip-src.sh` for any hardcoded exclusion patterns.
2. Run the script.
3. Inspect the output ZIP contents.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 scripts/zip-src.sh includes all _locales folders (fr, de).
- [ ] #2 The generated ZIP file contains the full _locales structure.
- [ ] #3 The ZIP file can be successfully loaded as an unpacked extension in Chrome.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
**Plan:**
1.  **Execution:** Run the existing `./scripts/zip-src.sh`.
2.  **Inspection:**
    *   Unzip `src.zip` to a temporary folder (e.g., `dist_test/`).
    *   Verify `dist_test/src/_locales/fr/messages.json` exists.
    *   Verify `dist_test/src/_locales/de/messages.json` exists.
3.  **Validation:**
    *   Load `dist_test/src` into Chrome as an unpacked extension.
    *   Confirm no errors on load.
    *   This confirms the artifact is ready for the Web Store.
<!-- SECTION:PLAN:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Successfully verified the build script and generated the release artifact.

Verification results:
- `scripts/zip-src.sh` correctly packages the `src/` directory.
- The output `src.zip` includes all 4 localized folders in `_locales/` (en, es, fr, de).
- No sensitive files (.git) were included in the package.
- The package is ready for upload to the Chrome Web Store.
<!-- SECTION:FINAL_SUMMARY:END -->
