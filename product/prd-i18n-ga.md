# Product Requirements Document: Internationalization (i18n) GA

## 1. Overview
**Title:** Internationalization (i18n) General Availability (GA)
**Status:** Draft
**Owner:** Product Manager (AI)

### Executive Summary
Mirlo's translation engine currently supports English, Spanish, French, and German. To reach GA, the extension's user interface and its Chrome Web Store presence must be fully localized in all four of these languages. This ensures a seamless, native experience for our core target audiences in Europe and the Americas.

## 2. Goals & Objectives
*   **Full UI Localization:** Support En, Es, Fr, and De in the extension interface.
*   **Store Parity:** 100% localization of the Chrome Web Store listing (Title, Description, Screenshots) for all 4 languages.
*   **Quality Assurance:** Verify layout integrity across all languages (especially German's longer strings).

## 3. Targeted Languages
*   **English (en)**
*   **Spanish (es)**
*   **French (fr)**
*   **German (de)**

## 4. Requirements

### 4.1. Extension UI Localization
*   **New Locales:** Create `_locales/fr/messages.json` and `_locales/de/messages.json`.
*   **Translation:** Extract and translate all strings from the English master file.
*   **Testing:** Verify the UI switches correctly when `chrome.i18n.getUILanguage()` changes.

### 4.2. Chrome Web Store Localization
*   **Descriptions:** Prepare localized "Long Descriptions" for the store for all 4 languages.
*   **Visual Assets:** 
    *   Capture 3-5 screenshots in each language (total 12-20 images).
    *   Ensure screenshots demonstrate the specific language pair support.
*   **Metadata:** Localize the Extension Name and Short Description in the manifest.

## 5. Success Metrics
*   Extension interface available in 4 languages.
*   Chrome Web Store listing fully localized for users in En, Es, Fr, and De regions.
