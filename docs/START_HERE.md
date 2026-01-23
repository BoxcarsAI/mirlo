# 👋 Welcome to the Mirlo Options Page Project!

## What You're Building

You'll be adding a configuration panel to the Mirlo Chrome extension that lets users select which languages to translate between. Currently, Mirlo only does English→Spanish. After your work, users will be able to choose from **4 tested language pairs** for a reliable beta launch:

**Supported Languages:**
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German

**Why just 4?** These languages are known to work reliably with Chrome's Translator API. We're keeping the beta simple and robust - no "not available" errors, no complex edge cases. More languages can be added later based on user requests!

## Your Toolkit

You have **three main documents** to guide you:

### 1. 📋 [tickets-options.md](tickets-options.md)
**Your main implementation guide**
- 6 tickets to complete in order
- Step-by-step instructions
- Code examples for each ticket
- Testing checklists

👉 **Start here for implementation details**

### 2. 🎨 [brand.md](brand.md)
**Design system and brand guidelines**
- Colors, fonts, spacing
- Component styles
- Logo usage rules
- Asset specifications

👉 **Reference this when styling**

### 3. 💻 [code-snippets.md](code-snippets.md)
**Copy-paste code patterns**
- Chrome Storage examples
- Common patterns
- Debugging tips
- Avoid common mistakes

👉 **Copy from here to save time**

## Before You Start

### 1. Understand the Current System

Read these existing files:
- `src/manifest.json` - Extension configuration
- `src/content.js` - Main translation logic (lines 1-100 to understand)
- `src/popup.html` - Current popup UI
- `src/styles.css` - Current styling

### 2. Set Up Your Environment

```bash
# Make sure you're in the project directory
cd /path/to/mirlo

# Create a feature branch
git checkout -b feature/options-page

# Load extension in Chrome
# 1. Open chrome://extensions
# 2. Enable "Developer mode"
# 3. Click "Load unpacked"
# 4. Select the /src folder
```

### 3. Test Current Functionality

Before changing anything:
- Visit an English article (e.g., Wikipedia, NYTimes)
- Enable Mirlo on the site
- Hover over a paragraph
- Click the bird badge to translate
- Verify it translates to Spanish

Now you understand what needs to change!

## Implementation Order

Complete tickets in this order (dependencies matter):

1. **MIRLO-OPT-001** ⚙️ Foundation
   - Create options.html, options.css, options.js
   - Update manifest.json
   - Verify options page opens

2. **MIRLO-OPT-002** 🎨 UI Design
   - Build the beautiful interface
   - Hero banner with gradient
   - Language dropdowns
   - Save button

3. **MIRLO-OPT-003** 💾 Options Logic
   - Save/load settings from chrome.storage
   - Validation
   - Success/error messages

4. **MIRLO-OPT-004** 🔌 Content Script Integration
   - Update content.js to read settings
   - Use selected languages for translation
   - Only activate on matching pages

5. **MIRLO-OPT-005** 📱 Popup Updates
   - Show current language pair
   - Add "Change languages" link

6. **MIRLO-OPT-006** ✨ Polish
   - Icons, animations
   - Keyboard shortcuts
   - Accessibility

**Estimated Time**: 2-3 days for all tickets (depends on experience level)

## Daily Workflow

### Each Morning:
1. Open the relevant ticket in tickets-options.md
2. Read the full ticket description
3. Reference brand.md for design specs
4. Check code-snippets.md for patterns

### While Coding:
1. Make small, incremental changes
2. Test frequently in Chrome
3. Use DevTools to debug
4. Commit working code often

### Before Moving to Next Ticket:
1. ✅ Complete all acceptance criteria
2. ✅ Run through testing checklist
3. ✅ No console errors
4. ✅ Commit with clear message

## Pro Tips

### 🔥 Reload Extension Often
After ANY code change:
1. Go to chrome://extensions
2. Click reload button under Mirlo
3. Reload any test pages

### 🐛 Debug with DevTools
- **Right-click extension icon → Inspect popup** to debug popup.js
- **Right-click options page → Inspect** to debug options.js
- **F12 on any webpage** to debug content.js
- **Check Console tab** for errors and logs

### 💾 Check Storage Anytime
In any extension context (popup, options, content), run in console:
```javascript
chrome.storage.sync.get(null, console.log)
```

### 🎨 Match the Brand
When styling, always use:
- Teal (#0F766E) for primary actions
- Orange (#F97316) for accents
- Manrope for headings
- Inter for body text
- 12px border radius for cards
- Smooth transitions (200ms)

### ⚠️ Common Mistakes
1. Forgetting `return true` in message listeners
2. Not handling chrome.runtime.lastError
3. Trying to use storage synchronously
4. Forgetting to reload extension after changes
5. Testing only on one website

## Questions & Getting Help

### Stuck on Implementation?
1. Check the code-snippets.md for examples
2. Look at existing code (content.js, popup.js)
3. Read Chrome Extension docs (links in tickets)
4. Check console for error messages

### Design Questions?
1. Reference brand.md color palette
2. Look at Toucan extension for inspiration
3. Keep it simple and clean
4. When in doubt, use more whitespace

### Need Clarification?
1. Re-read the ticket description
2. Check acceptance criteria
3. Look at example code in snippets
4. Ask your team lead

## Success Criteria

You're done when:
- ✅ All 6 tickets completed
- ✅ Options page looks beautiful (matches brand.md)
- ✅ Settings save and persist
- ✅ Translations use selected languages
- ✅ Popup shows current language pair
- ✅ All tests pass
- ✅ No console errors
- ✅ Works on multiple websites
- ✅ Keyboard navigation works
- ✅ Code is clean and commented

## Final Checklist

Before submitting your work:

```
[ ] All 6 tickets marked complete
[ ] Options page opens from right-click menu
[ ] Can select different language pairs
[ ] Settings save successfully
[ ] Settings persist after browser restart
[ ] Content script respects language settings
[ ] Popup displays current language pair
[ ] Tested on 3+ different websites
[ ] Tested responsive design (resize browser)
[ ] Tested keyboard navigation
[ ] No console errors anywhere
[ ] Code follows existing style
[ ] Git commits are clear and organized
```

## Ready to Start?

1. Open [tickets-options.md](tickets-options.md)
2. Jump to **MIRLO-OPT-001**
3. Follow the instructions step-by-step
4. Reference brand.md and code-snippets.md as needed
5. Test frequently
6. Have fun! 🎉

Remember: **Start small, test often, commit working code.**

You've got this! 🚀

---

*Questions? Check the bottom of code-snippets.md for debugging tips and common issues.*
