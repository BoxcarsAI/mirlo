# Screenshot Guide for Chrome Web Store

## Overview

You need **4 screenshots** that tell the story of using Mirlo. Chrome Web Store requires at least 1, but 3-5 is recommended.

**Recommended size**: 1280x800px (or 640x400px)

---

## The 4-Step Story

### Screenshot 1: Enable Mirlo
**What to show**: Activation toast appearing on a real Spanish website

**How to capture**:
1. Load extension (unpacked) in Chrome
2. Visit a Spanish news site you've never enabled Mirlo on:
   - El País: https://elpais.com
   - BBC Mundo: https://www.bbc.com/mundo
   - Wikipedia ES: https://es.wikipedia.org
3. Wait for activation toast to appear
4. Take screenshot (Cmd+Shift+4 or DevTools)

**Key elements**:
- Real website content visible
- Activation toast clearly shown
- "Enable Mirlo on this site?" message visible

---

### Screenshot 2: Choose Language
**What to show**: Options page with language selection

**How to capture**:
1. Right-click extension icon → Options
2. Options page opens in new tab
3. Make sure dropdowns show: English → Spanish (or your preferred pair)
4. Capture the full options page

**Key elements**:
- Both language dropdowns visible
- Clean, professional look
- Mirlo hero banner at top
- "Save Settings" button visible

---

### Screenshot 3: Translate Paragraph
**What to show**: Main feature in action—translated paragraph with tooltip

**How to capture**:
1. On an enabled Spanish website, click a paragraph
2. Mirlo tooltip appears with English translation
3. Capture while tooltip is visible
4. Make sure selected paragraph is highlighted

**Key elements**:
- Spanish article clearly visible
- Paragraph highlighted/selected
- Mirlo tooltip showing English translation
- Real article (not test content)

**Pro tip**: Use a well-known publication like El País for credibility

---

### Screenshot 4: Toggle Back
**What to show**: Clicking again to see original (toggle feature)

**How to capture**:
1. On a translated paragraph, click it again
2. Tooltip shows "Switch to Spanish" button
3. Capture this state

**Key elements**:
- Same article as Screenshot 3 (shows continuity)
- Tooltip with "Switch to Spanish" button
- Demonstrates the toggle/test-yourself feature

---

## Two Approaches

### Approach A: Clean & Simple (Easier)
Just take clean screenshots at 1280x800px of each step. No frames, no annotations.

**Pros**:
- Quick to create
- Chrome Web Store accepts these
- Still tells the story

**Cons**:
- Less polished
- Users might miss key details

---

### Approach B: Framed & Annotated (Professional)
Use the `screenshot-frame.html` template to add:
- Step numbers and titles
- Callout arrows pointing to features
- Captions explaining what's happening

**Pros**:
- Very professional
- Guides viewer's eye
- Explains features clearly

**Cons**:
- Requires more setup
- Need to edit HTML and compose images

---

## Recommended Workflow

### Step 1: Capture Raw Screenshots
Take 4 clean screenshots of the extension in action:

```bash
marketing/screenshots/raw/
├── raw-01-activation.png    # Activation toast
├── raw-02-options.png        # Options page
├── raw-03-translate.png      # Translation in action
└── raw-04-toggle.png         # Toggle feature
```

### Step 2: Choose Your Approach

**Option A**: Submit raw screenshots as-is (rename and upload)

**Option B**: Use `screenshot-frame.html` to frame them:
1. Edit HTML to replace placeholder `<div>` with `<img src="raw/raw-01-activation.png">`
2. Adjust callout positions
3. Use DevTools to capture each framed screenshot
4. Save as final screenshots

### Step 3: Final Files
```bash
marketing/screenshots/
├── 01-enable-mirlo.png       # 1280x800px
├── 02-choose-language.png    # 1280x800px
├── 03-translate.png          # 1280x800px
└── 04-toggle.png             # 1280x800px
```

---

## Recommended Sites for Screenshots

### Spanish
- **El País** (https://elpais.com) - Premium journalism, recognizable
- **BBC Mundo** (https://www.bbc.com/mundo) - Trusted news
- **Wikipedia ES** (https://es.wikipedia.org) - Everyone knows it

### French
- **Le Monde** (https://www.lemonde.fr)
- **Wikipedia FR** (https://fr.wikipedia.org)

### German
- **Der Spiegel** (https://www.spiegel.de)
- **Wikipedia DE** (https://de.wikipedia.org)

**Why these?**: Recognizable brands add credibility. Users see "Oh, it works on El País!" and trust it.

---

## Screenshot Best Practices

### ✅ DO:
- Use real, interesting content (actual news articles)
- Keep browser at 100% zoom
- Close unnecessary tabs/windows
- Use well-known websites (El País, Wikipedia, BBC)
- Show the full feature workflow
- Keep UI clean and professional

### ❌ DON'T:
- Use Lorem Ipsum or test content
- Show developer tools or console errors
- Include personal information in visible tabs
- Use broken or half-loaded pages
- Show the extension on inappropriate sites
- Include other extensions' icons (clean toolbar)

---

## Technical Details

### Accepted Formats
- PNG (recommended)
- JPEG

### Accepted Sizes
- **Recommended**: 1280x800px (16:10 ratio)
- **Alternative**: 640x400px (same ratio)
- **Max file size**: 16MB per image

### How Many?
- **Minimum**: 1 screenshot
- **Recommended**: 3-5 screenshots
- **Maximum**: 5 screenshots

---

## Quick Start (Minimal Effort)

If you want to get screenshots done quickly:

1. **Take 3 simple screenshots** (skip the framing):
   - Options page (full page)
   - Translation in action (article + tooltip)
   - Toggle feature (tooltip with "Switch to Spanish")

2. **Resize to 1280x800px** if needed

3. **Upload to Chrome Web Store**

This is totally acceptable and many extensions do this. The framed approach is just extra polish.

---

## Tools You Can Use

### Built-in
- **Chrome DevTools**: Right-click → Inspect → Capture node screenshot
- **macOS Screenshot**: Cmd+Shift+4 (drag to select area)

### Optional (for framing/editing)
- **Figma** (free): Design frames and annotations
- **Canva** (free): Add text and arrows
- **Preview** (macOS): Basic cropping and resizing
- **Photoshop/Sketch**: Full control

---

## Need Help?

Once you have raw screenshots, I can:
- Help you frame them using the HTML template
- Adjust callout positions
- Suggest which screenshots work best
- Help you compose the final images

Just let me know!
