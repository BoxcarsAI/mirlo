# Mirlo Beta Cleanup Tickets

These tickets prepare Mirlo for beta release. They should be completed in order (dependencies noted).

---

## MIRLO-001: Remove Status Badge - COMPLETED

**Priority:** P0 (Critical)
**Estimated Complexity:** Simple
**Dependencies:** None

### Description
Remove the always-visible status indicator in the top-right corner of the page. This dark pill badge (`Mirlo: Hover a paragraph to translate`) is distracting and provides little value once users understand how the extension works.

### Current Behavior
- A fixed badge appears in the top-right corner on every page
- Shows status messages like "Mirlo: Checking...", "Mirlo: Ready to translate", etc.
- Always visible, even when user isn't interacting with Mirlo

### Desired Behavior
- No status badge visible anywhere
- Remove all code related to the status badge

### Files to Modify
- `src/content.js` - Remove `ensureStatus()`, `setStatus()`, `statusEl` variable, and all `setStatus()` calls
- `src/styles.css` - Remove `.mirlo-status` styles

### Acceptance Criteria
- [ ] No fixed element appears in the top-right corner
- [ ] No console errors after removal
- [ ] Translation still works correctly (status was display-only)

### Testing
1. Load extension on any page (e.g., nytimes.com)
2. Verify no Mirlo UI appears until user hovers a paragraph
3. Translate a paragraph - verify it still works without status updates

---

## MIRLO-002: Per-Site Activation with Article Detection - COMPLETED

**Priority:** P0 (Critical)
**Estimated Complexity:** Medium-High
**Dependencies:** None

### Description
Mirlo should be silent by default. On pages that look like articles, show a one-time toast prompt asking users to enable Mirlo for that domain. Store enabled domains in Chrome storage.

### Current Behavior
- Extension activates on ALL websites (`<all_urls>`)
- Badge appears on every eligible paragraph everywhere
- No user control over which sites Mirlo runs on

### Desired Behavior

#### Detection Logic
Check if page is article-like using these signals (in order):
1. `<meta property="og:type" content="article">`
2. Schema.org Article markup (`@type: "Article"`, `"NewsArticle"`, `"BlogPosting"`)
3. URL contains `/article/`, `/post/`, `/blog/`, `/news/`, `/story/`
4. Page has 3+ paragraphs with 15+ words each (fallback heuristic)

#### Activation Flow
```
Page Load
    │
    ▼
Is domain already enabled? ──Yes──> Activate Mirlo normally
    │
    No
    ▼
Is page article-like? ──No──> Stay silent (no UI)
    │
    Yes
    ▼
Show toast prompt (bottom-right)
    │
    ├── User clicks "Enable" ──> Save domain to storage, activate Mirlo
    │
    └── User clicks "Not now" or toast auto-dismisses ──> Stay silent
```

#### Toast Design
- Position: Fixed, bottom-right, 16px from edges
- Size: ~280px wide, auto height
- Content:
  ```
  [🌐 icon] Enable Mirlo on nytimes.com?
  [Enable] [Not now]
  ```
- Auto-dismiss after 8 seconds if no interaction
- Animate in (slide up + fade), animate out (fade)
- Store "dismissed" state for domain permanently (never re-prompt once dismissed)

### Storage Schema
```javascript
// chrome.storage.sync
{
  "mirlo:enabled_domains": ["nytimes.com", "medium.com", "bbc.com"],
  "mirlo:dismissed_domains": ["wikipedia.org"]  // Don't re-prompt
}
```

### Files to Modify
- `src/content.js` - Add detection logic, toast UI, storage read/write
- `src/styles.css` - Add toast styles
- `src/manifest.json` - Add `"storage"` permission

### Acceptance Criteria
- [ ] Extension is silent on non-article sites (e.g., google.com, amazon.com)
- [ ] Toast appears on article pages (e.g., nytimes.com article)
- [ ] Clicking "Enable" saves domain and immediately activates Mirlo
- [ ] Clicking "Not now" dismisses toast, doesn't re-show on that domain
- [ ] Previously enabled domains auto-activate without prompt
- [ ] User can still manually enable via popup (future ticket for popup update)

### Testing
1. Load extension on google.com - verify no UI appears
2. Load extension on an NYTimes article - verify toast appears
3. Click "Enable" - verify badge now appears on paragraph hover
4. Navigate to different NYTimes article - verify Mirlo auto-activates (no toast)
5. Load extension on Wikipedia - verify toast appears (dismiss it)
6. Reload Wikipedia - verify no toast appears again (dismissed state saved)

---

## MIRLO-003: Replace Background Styling with End Marker COMPLETED

**Priority:** P0 (Critical)
**Estimated Complexity:** Simple
**Dependencies:** None

### Description
The current beige background on translated paragraphs causes layout issues on many sites (background bleeds over other elements, especially on Wikipedia). Replace with a small, unobtrusive marker at the end of the paragraph.

### Current Behavior
- Translated paragraphs get `background-color: #f6f2e7`
- Adds padding, box-shadow, border-radius
- Causes visual conflicts on sites with complex layouts

### Desired Behavior
- No background color change
- No padding/shadow changes
- Append a small marker to the end of translated text: ` ·` (thin space + middle dot)
- Marker should be styled subtly (muted color, smaller font)
- Marker is part of the text content (not a separate element)

### Implementation Notes
```javascript
// When applying translation, append marker
paragraph.innerText = translated + " ·";

// When reverting, don't include marker in stored original
// The marker is visual-only, not part of the actual content
```

### Marker Styling
- Character: Middle dot `·` (U+00B7) or bullet `•`
- Color: Muted gray, e.g., `#9ca3af`
- Could be wrapped in a span for styling: `<span class="mirlo-marker">·</span>`

### Files to Modify
- `src/content.js` - Modify `applyTranslatedText()` to append marker instead of adding class
- `src/content.js` - Keep `.mirlo-translated` class but only for state tracking (tooltip handler)
- `src/styles.css` - Remove background/padding styles from `.mirlo-translated`, add `.mirlo-marker` style

### Acceptance Criteria
- [ ] Translated paragraphs have no background color change
- [ ] Small `·` marker appears at end of translated text
- [ ] Marker is visually subtle (doesn't draw attention)
- [ ] Tooltip still appears on hover of translated paragraph
- [ ] Toggle between English/Spanish still works correctly
- [ ] No layout shifts or visual conflicts on Wikipedia, NYTimes, Medium

### Testing
1. Translate a paragraph - verify no background color appears
2. Verify small dot marker is visible at end of translated text
3. Test on Wikipedia - verify no visual bleeding/conflicts
4. Toggle translation via tooltip - verify marker appears/disappears appropriately

---

## MIRLO-004: Simplify Badge to Globe Icon Only - COMPLETED

**Priority:** P1 (Important)
**Estimated Complexity:** Simple
**Dependencies:** None

### Description
The current badge shows `🌐 MIRLO` which takes up visual space. Simplify to just the globe icon for a more subtle appearance.

### Current Behavior
```html
<button class="mirlo-badge">
  <span class="mirlo-badge-icon">🌐</span>
  <span class="mirlo-badge-text">MIRLO</span>
</button>
```

### Desired Behavior
```html
<button class="mirlo-badge" title="Translate with Mirlo">
  🌐
</button>
```
- Just the globe emoji, no text
- Add `title` attribute for accessibility/discoverability
- Smaller overall size
- Keep the hover animations

### Future Note
Eventually we want to replace the globe with a custom mirlo (blackbird) icon. For now, globe is fine.

### Files to Modify
- `src/content.js` - Simplify badge HTML in `ensureBadge()`
- `src/styles.css` - Adjust `.mirlo-badge` sizing (smaller padding)

### Acceptance Criteria
- [ ] Badge shows only 🌐 emoji
- [ ] Badge has `title="Translate with Mirlo"` for tooltip on hover
- [ ] Badge is visually smaller than before
- [ ] Click behavior unchanged (still triggers translation)

### Testing
1. Hover over a paragraph - verify badge shows globe only
2. Hover over badge - verify browser tooltip shows "Translate with Mirlo"
3. Click badge - verify translation still works

---

## MIRLO-005: Smarter Paragraph Eligibility COMPLETED

**Priority:** P1 (Important)
**Estimated Complexity:** Medium
**Dependencies:** None

### Description
Currently we skip paragraphs in `nav`, `header`, `footer`, `aside`. Expand this to skip more non-content areas to reduce false positives.

### Current Behavior
```javascript
function isVisibleElement(element) {
  if (!element) return false;
  if (element.closest("nav,header,footer,aside")) return false;
  // ...
}
```

### Desired Behavior
Skip paragraphs that are inside:
- Existing: `nav`, `header`, `footer`, `aside`
- Add: Elements with these roles: `navigation`, `banner`, `contentinfo`, `complementary`, `search`, `form`
- Add: Elements with these classes (common patterns): `.sidebar`, `.menu`, `.nav`, `.footer`, `.header`, `.comment`, `.comments`, `.ad`, `.advertisement`, `.promo`, `.related`, `.recommended`
- Add: Elements with these IDs: `#sidebar`, `#menu`, `#nav`, `#footer`, `#header`, `#comments`
- Add: Inside `form` elements

### Implementation
```javascript
const SKIP_CONTAINERS = [
  // Tags
  'nav', 'header', 'footer', 'aside', 'form',
  // Roles
  '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
  '[role="complementary"]', '[role="search"]', '[role="form"]',
  // Common classes
  '.sidebar', '.menu', '.nav', '.footer', '.header',
  '.comment', '.comments', '.ad', '.advertisement', '.promo',
  '.related', '.recommended',
  // Common IDs
  '#sidebar', '#menu', '#nav', '#footer', '#header', '#comments'
].join(',');

function isVisibleElement(element) {
  if (!element) return false;
  if (element.closest(SKIP_CONTAINERS)) return false;
  // ...
}
```

### Files to Modify
- `src/content.js` - Update `isVisibleElement()` with expanded skip logic

### Acceptance Criteria
- [ ] Paragraphs in sidebars don't show badge on hover
- [ ] Paragraphs in comment sections don't show badge
- [ ] Paragraphs in navigation/menu areas don't show badge
- [ ] Main article content still shows badge correctly

### Testing
1. Test on a site with sidebar content (e.g., Wikipedia) - verify sidebar paragraphs are skipped
2. Test on a site with comments (e.g., Medium, blog) - verify comment paragraphs are skipped
3. Test on a news article - verify main content paragraphs still work
4. Test on a site with related articles section - verify those are skipped

---

## MIRLO-006: Update Popup for Site Management - COMPLETED

**Priority:** P2 (Nice to Have)
**Estimated Complexity:** Medium
**Dependencies:** MIRLO-002

### Description
Update the extension popup to show current site status and allow manual enable/disable.

### Desired Behavior
Popup should show:
```
┌─────────────────────────┐
│ Mirlo                   │
├─────────────────────────┤
│ nytimes.com             │
│ [✓ Enabled] [Disable]   │
│                         │
│ ─────────────────────── │
│ Target: Spanish         │
│ AI Status: Ready        │
└─────────────────────────┘
```

- Show current domain
- Show enabled/disabled status
- Button to toggle
- Keep existing AI status info

### Files to Modify
- `src/popup.html` - Update UI layout
- `src/popup.js` - Add storage read/write, messaging to content script

### Acceptance Criteria
- [ ] Popup shows current domain
- [ ] Popup shows if Mirlo is enabled for this domain
- [ ] User can enable/disable from popup
- [ ] Changes take effect immediately (content script responds)

---

## Implementation Order

1. **MIRLO-001** (Remove status badge) - Quick win, immediate improvement
2. **MIRLO-003** (End marker instead of background) - Fixes Wikipedia issue
3. **MIRLO-004** (Simplify badge) - Quick visual improvement
4. **MIRLO-005** (Smarter eligibility) - Reduces noise
5. **MIRLO-002** (Per-site activation) - Biggest change, most impact
6. **MIRLO-006** (Popup update) - Polish, depends on MIRLO-002

---

## Notes for Developers

### Testing Approach
- Test on: NYTimes, Wikipedia, Medium, BBC News, personal blogs
- Check for: Layout conflicts, z-index issues, console errors
- Verify: Translation still works end-to-end after each change

### Code Style
- Keep the IIFE pattern in content.js
- Use `const` for constants, `let` for mutable state
- No external dependencies - vanilla JS only
- Follow existing naming conventions (`mirlo-*` for classes)

### Chrome APIs Reference
- [chrome.storage.sync](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Manifest V3 permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)
