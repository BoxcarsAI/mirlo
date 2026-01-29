# Mirlo Development Guide

Welcome to the Mirlo project! This guide provides a technical overview of how the extension is structured and how to contribute.

## Project Vision

Mirlo bridges the gap between beginner apps and native-level fluency. We help intermediate learners read authentic content while prioritizing their privacy through local AI translations.

## Architecture Overview

- **`src/manifest.json`**: The extension's entry point and configuration.
- **`src/content.js`**: Injects the translation UI into web pages. It detects paragraphs and handles the click-to-translate logic.
- **`src/popup.js` / `popup.html`**: The small UI that appears when you click the extension icon in the toolbar. Shows status and quick links.
- **`src/options.js` / `options.html`**: The settings page where users select their language pairs.
- **`src/utils/i18n.js`**: A utility script to handle runtime HTML localization.
- **`src/_locales/`**: Standard Chrome i18n directory containing translations for the UI.

## Supported Languages

We currently support 4 core languages:
- 🇬🇧 English (`en`)
- 🇪🇸 Spanish (`es`)
- 🇫🇷 French (`fr`)
- 🇩🇪 German (`de`)

These were chosen because they work reliably with Chrome's built-in `window.ai` and Translation APIs.

## Development Workflow

### 1. Local Setup
```bash
# Clone the repo
git clone https://github.com/boxcarsai/mirlo
cd mirlo

# Load as unpacked extension in Chrome
# (See [INSTALL.md](INSTALL.md) for details)
```

### 2. Making Changes
- All application code lives in the `src/` directory.
- After making changes, go to `chrome://extensions` and click the **Reload** icon on the Mirlo card.
- Refresh your test pages to see the changes in action.

### 3. Localization
If you add new UI elements, ensure you:
1.  Add the string to `src/_locales/en/messages.json`.
2.  Use the `data-i18n="messageKey"` attribute in HTML.
3.  Add translations to the other `messages.json` files in `_locales/`.

## Quality Standards

- **Privacy First**: Never add external API calls or tracking scripts. All processing must stay local.
- **Performance**: Keep the content script lightweight to avoid slowing down the user's browsing experience.
- **Accessibility**: Ensure all UI elements are keyboard-navigable and have appropriate ARIA labels.