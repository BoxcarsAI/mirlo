# Mirlo Marketing Assets

This folder contains all marketing materials for Mirlo that are NOT part of the extension itself.

## Folder Structure

```
marketing/
├── README.md                    # This file
├── promo-tile.html             # HTML to generate Chrome Web Store promo tile
├── promo-tile-440x280.png      # Generated promo tile (440x280px)
├── screenshots/                # Chrome Web Store screenshots
│   ├── 01-in-action.png       # Extension translating a paragraph
│   ├── 02-options-page.png    # Options/settings page
│   └── 03-popup.png           # Extension popup
└── store-listing.md            # Chrome Web Store listing copy
```

## Required Assets for Chrome Web Store

### 1. Promo Tile (440x280px)
- **File**: `promo-tile-440x280.png`
- **Generate**: Open `promo-tile.html` in Chrome, use DevTools to capture node screenshot
- **Purpose**: Shown in Chrome Web Store search results and category pages

### 2. Screenshots (1280x800px or 640x400px)
- **Minimum**: 1 screenshot required
- **Recommended**: 3-5 screenshots
- **Purpose**: Show the extension in action to potential users

**Recommended screenshots:**
1. Extension translating a paragraph on a real website
2. Options page showing language selection
3. Popup showing enable/disable functionality
4. (Optional) Before/after of reading a Spanish article
5. (Optional) Toggle feature showing original vs translated text

### 3. Icon (Already in src/assets/)
- Extension icons are in `/src/assets/` (mirlo-16.png, 32, 48, 128)
- These are used by the extension and submitted with the extension package
- Do NOT duplicate them here

## What Goes Here vs. src/

### ✅ Goes in `marketing/`
- Promo tiles for Chrome Web Store
- Screenshots for store listing
- Store listing copy/descriptions
- Social media graphics
- Press kit materials
- Launch announcement assets

### ❌ Stays in `src/` or `src/assets/`
- Extension icons (mirlo-16.png, 32, 48, 128)
- Extension UI assets (mirlo.png, mirlo-hero-banner.png)
- Any image/asset actually used by the extension code

## Generating Assets

### Promo Tile
```bash
# Open in browser
open marketing/promo-tile.html

# Then use DevTools to capture screenshot
# Or use macOS screenshot tool (Cmd+Shift+4)
```

### Screenshots
1. Install extension in Chrome (unpacked from src/)
2. Visit a Spanish website (e.g., Wikipedia ES)
3. Use extension features
4. Take screenshots at 1280x800px (or let Chrome Web Store resize)

**Tips:**
- Use Chrome DevTools device mode for consistent sizing
- Show real content, not Lorem Ipsum
- Highlight key features with arrows/callouts if needed
- Keep UI clean, close unnecessary tabs

## Store Listing Copy

See `store-listing.md` for:
- Extension name
- 132-character summary
- Detailed description
- Privacy policy link
- Support/website links

## Reference

- Marketing strategy: `/docs/marketing.md`
- Brand guidelines: `/docs/brand.md`
- Privacy policy URL: https://www.boxcars.ai/mirlo-privacy-policy/
