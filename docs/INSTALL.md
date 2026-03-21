# Installation Guide

## From Chrome Web Store

Install Mirlo from the [Chrome Web Store listing](https://chromewebstore.google.com/detail/bolaihmnmcaedodmcempenkddbkolaih/).

## Manual Install (Development)

1. Clone the repo and build:
   ```bash
   git clone https://github.com/boxcarsai/mirlo
   cd mirlo
   npm install
   npm run build
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked** and select the `.output/chrome-mv3/` directory

## Configure Languages

1. Right-click the Mirlo icon in your toolbar (or find it under the puzzle piece icon)
2. Select **Options**
3. Choose your **Native Language** and **Learning Language**
4. Set your preferred **Translation Density** (Low / Medium / High)
5. Click **Save Settings**

## How It Works

1. Visit a website in your native or learning language
2. When Mirlo detects an article-like page, it asks if you want to enable translations for that domain
3. Once enabled, individual words are automatically replaced with translations in your learning language
4. Hover over any translated word to see the original in a tooltip
5. Hover over a paragraph to see the Mirlo badge — click it for a full paragraph translation

## Prerequisites

Mirlo uses Chrome's built-in Translator API. You need:
- Chrome 131+ (or a recent Canary/Dev channel build)
- `chrome://flags/#translation-api` set to **Enabled**

## Troubleshooting

- **No translations appearing?** Check that the Translator API flag is enabled and Chrome is up to date.
- **No activation prompt?** Mirlo only prompts on article-like pages. Try a news site or Wikipedia.
- **Wrong translation direction?** Mirlo detects paragraph language automatically. If the page has mixed languages, each paragraph translates based on its detected language.
