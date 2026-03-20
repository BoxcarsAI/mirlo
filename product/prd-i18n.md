# Product Requirements Document: Internationalization (i18n) Support

## 1. Overview
**Title:** Extension Internationalization (i18n)
**Status:** Completed (superseded by prd-i18n-ga.md)
**Owner:** Product Manager (AI)

### Executive Summary
Currently, Mirlo's user interface is hardcoded in English. To reach a global audience and align with our mission of language learning, we must localize the extension's interface. This PRD outlines the requirements for implementing the standard Chrome Extension i18n infrastructure, enabling us to easily add new languages.

## 2. Problem Statement
*   **User Barrier:** Non-English speakers cannot navigate the settings or understand the popup interface effectively.
*   **Scalability:** Adding support for a new interface language currently requires code changes, which is brittle and unscalable.
*   **Store Presence:** Chrome Web Store visibility is limited if the extension is not localized.

## 3. Goals & Objectives
*   **Primary Goal:** Decouple text strings from the codebase.
*   **Secondary Goal:** Launch with full support for **English (en)** and **Spanish (es)** as the pilot languages.
*   **Technical Goal:** Implement `_locales` directory structure and `chrome.i18n` API usage across Manifest, HTML, CSS, and JavaScript.

## 4. User Stories
*   **As a user** whose browser is set to Spanish, I want to see the Mirlo popup, options page, and context menus in Spanish so that I can configure the extension comfortably.
*   **As a developer**, I want to add a new language by simply adding a JSON file, without touching the core code.

## 5. Requirements

### 5.1. Core Infrastructure
*   **Directory Structure:** Create `_locales/{locale_code}/messages.json` structure.
*   **Manifest:** Update `src/manifest.json` to include `"default_locale": "en"`.
*   **CSS:** Use `__MSG_@@bidi_dir__` and related predefined messages to support potential future RTL (Right-to-Left) layouts, or simply ensure CSS handles variable text lengths gracefully.

### 5.2. String Extraction (Scope)
All user-facing text must be extracted to `messages.json`. This includes:
1.  **Manifest Metadata:** Name, Description, Action Title.
2.  **Popup UI:** Headings, buttons, tooltips, status messages.
3.  **Options UI:** Labels, instructions, error messages, save confirmations.
4.  **Content Script UI:** Injected tooltips, translation popovers, error states within the page.

### 5.3. Locale Support
*   **Default:** English (`en`).
*   **MVP Additional:** Spanish (`es`).

## 6. Technical Implementation Strategy
*   **HTML:** Replace text content with `__MSG_messagename__` tags where supported, or use a localization script to replace `data-i18n` attributes at runtime (common pattern for complex HTML).
*   **JavaScript:** Replace string literals with `chrome.i18n.getMessage('message_name')`.
*   **CSS:** Ensure containers (buttons, labels) are flexible (`flexbox`, `auto` width) to accommodate varying string lengths (e.g., German is often longer than English).

## 7. MVP vs. Robust (Future)

| Feature | MVP | Robust / Future |
| :--- | :--- | :--- |
| **Languages** | English, Spanish | French, German, Japanese, etc. |
| **Asset Localization** | English Screenshots | Localized Screenshots for Store |
| **Date/Number Formats** | Standard/ISO | Locale-specific formatting |
| **RTL Support** | Basic CSS prep | Full RTL Testing (Arabic/Hebrew) |
| **Workflow** | Manual JSON editing | Translation Management System (TMS) integration |

## 8. Open Questions
1.  Are there specific regional dialects we should target (e.g., `es-419` vs `es-ES`), or is generic `es` sufficient for MVP?
2.  Do we need to localize the "Help" or "Docs" links, or can they remain in English for now?
3.  Should the "Learning Language" names (e.g., "Spanish", "French") be translated in the dropdowns (e.g., "Español", "Français")? (Recommended: Yes, or use native names).

## 9. Success Metrics
*   **Zero Hardcoded Strings:** Automated scan reveals no user-facing string literals in the source code.
*   **Language Switch:** Changing Chrome's browser language to Spanish automatically renders the extension in Spanish.
