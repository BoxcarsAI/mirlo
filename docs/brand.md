# Mirlo Brand Guidelines

## Brand Overview

**Mirlo** (Spanish for "blackbird") is a privacy-first language learning Chrome extension inspired by [Toucan](https://jointoucan.com/). Our brand embodies:

- **Playful & Friendly**: Language learning should be fun, not intimidating
- **Colorful & Vibrant**: Multi-language, multi-cultural, globally inclusive
- **Modern & Clean**: Contemporary design with smooth interactions
- **Approachable**: Not corporate or stuffy; welcoming to learners of all levels

---

## Logo & Bird Character

### Primary Logo
**File**: `src/assets/mirlo.png`

The Mirlo bird is a friendly blackbird with an open beak "eating" or "singing" colorful letters from various writing systems. This symbolizes:
- Language acquisition (eating words)
- Global communication (multiple scripts)
- Joyful learning (vibrant colors, open expression)

### Logo Usage

#### ✅ Do:
- Use the full-color version for the options page hero banner
- Maintain clear space around the logo (minimum 20px padding)
- Scale proportionally (never stretch or distort)
- Place on white or light backgrounds for best contrast
- Center-align in hero sections

#### ❌ Don't:
- Change the bird's colors or alter the illustration
- Add effects (drop shadows, glows, bevels)
- Rotate or skew the logo
- Place on busy backgrounds that reduce legibility
- Use the PNG on dark backgrounds (need SVG version for that)

### Logo Variations Needed

#### High Priority
1. **mirlo-icon.svg** (128×128px)
   - Simplified SVG version of the bird
   - Monochrome for small sizes (e.g., browser action icon)
   - Should work at 16×16px minimum
   - Use solid black or brand teal

2. **mirlo-wordmark.svg**
   - "Mirlo" text next to bird icon
   - For options page header
   - Font: Manrope Bold, ~48pt
   - Color: Brand Black (#0F172A)

3. **mirlo-badge-icon.svg** (32×32px)
   - Ultra-simple bird silhouette for the inline badge
   - Currently using full SVG path in content.js
   - Should be recognizable as a bird at tiny sizes
   - Single color for flexibility

#### Medium Priority
4. **mirlo-hero-banner.png** (1200×400px)
   - Wide banner for options page hero section
   - Bird centered with gradient background
   - Use brand gradient (see color palette)
   - Optimized for web (PNG or WebP)

5. **mirlo-social-preview.png** (1280×640px)
   - For Chrome Web Store listing
   - Includes wordmark and tagline
   - Vibrant, eye-catching

#### Low Priority
6. **mirlo-dark-mode.svg**
   - Version for dark backgrounds
   - Light colors, high contrast
   - For future dark mode support

---

## Color Palette

Our color palette is inspired by the vibrant, multicultural letters surrounding the Mirlo bird.

### Primary Colors

#### Brand Teal (Primary Action Color)
- **Teal 700**: `#0F766E` - Primary buttons, links, emphasis
- **Teal 600**: `#0D9488` - Hover states
- **Teal 100**: `#CCFBF1` - Light backgrounds, success states

```css
--mirlo-teal-700: #0f766e;
--mirlo-teal-600: #0d9488;
--mirlo-teal-100: #ccfbf1;
```

**Usage**: Primary action buttons, active states, success messages, links

#### Brand Orange (Accent Color)
- **Orange 500**: `#F97316` - Accents, highlights, call-to-action
- **Orange 400**: `#FB923C` - Hover states
- **Orange 100**: `#FFEDD5` - Light backgrounds

```css
--mirlo-orange-500: #f97316;
--mirlo-orange-400: #fb923c;
--mirlo-orange-100: #ffedd5;
```

**Usage**: Secondary buttons, badges, notification dots, excitement

### Neutral Colors

#### Slate (Body Text & Backgrounds)
- **Slate 900**: `#0F172A` - Headings, dark text
- **Slate 700**: `#334155` - Body text
- **Slate 400**: `#94A3B8` - Muted text, disabled states
- **Slate 200**: `#E2E8F0` - Borders, dividers
- **Slate 100**: `#F1F5F9` - Light backgrounds
- **White**: `#FFFFFF` - Cards, primary background

```css
--mirlo-slate-900: #0f172a;
--mirlo-slate-700: #334155;
--mirlo-slate-400: #94a3b8;
--mirlo-slate-200: #e2e8f0;
--mirlo-slate-100: #f1f5f9;
--mirlo-white: #ffffff;
```

### Semantic Colors

#### Success (Green)
- **Green 600**: `#059669` - Success text, checkmarks
- **Green 100**: `#D1FAE5` - Success backgrounds

```css
--mirlo-green-600: #059669;
--mirlo-green-100: #d1fae5;
```

#### Error (Red)
- **Red 600**: `#DC2626` - Error text, warnings
- **Red 100**: `#FEE2E2` - Error backgrounds

```css
--mirlo-red-600: #dc2626;
--mirlo-red-100: #fee2e2;
```

#### Info (Blue)
- **Blue 600**: `#2563EB` - Info text
- **Blue 100**: `#DBEAFE` - Info backgrounds

```css
--mirlo-blue-600: #2563eb;
--mirlo-blue-100: #dbeafe;
```

### Gradient Backgrounds

#### Primary Gradient (Hero Sections)
```css
background: linear-gradient(135deg, #0F766E 0%, #2DD4BF 50%, #F97316 100%);
/* Teal → Light Teal → Orange */
```

#### Subtle Gradient (Cards, Hover States)
```css
background: linear-gradient(135deg, #F0FDFA 0%, #FFF7ED 100%);
/* Very light teal → Very light orange */
```

---

## Typography

### Font Families

#### Headings: Manrope
- **Source**: [Google Fonts - Manrope](https://fonts.google.com/specimen/Manrope)
- **Weights**: 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
- **Usage**: Page titles, section headings, hero text
- **Characteristics**: Geometric, modern, friendly, slightly rounded

```css
font-family: 'Manrope', system-ui, -apple-system, sans-serif;
```

#### Body Text: Inter
- **Source**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold)
- **Usage**: Body copy, UI labels, buttons, form inputs
- **Characteristics**: Highly legible, optimized for screens, professional

```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Font Import
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
```

### Type Scale

#### Options Page
```css
/* Hero Title */
.options-hero-title {
  font-family: 'Manrope', sans-serif;
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--mirlo-slate-900);
}

/* Hero Subtitle */
.options-hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--mirlo-slate-700);
}

/* Section Headings */
.options-section-title {
  font-family: 'Manrope', sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--mirlo-slate-900);
}

/* Labels */
.options-label {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--mirlo-slate-900);
}

/* Hint Text */
.options-label-hint {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--mirlo-slate-400);
}

/* Body Text */
.options-body {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--mirlo-slate-700);
}

/* Buttons */
.options-button {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
}
```

#### Popup (Compact Sizes)
```css
/* Popup Title */
font-size: 14px;
font-weight: 600;

/* Popup Body */
font-size: 12px;
font-weight: 400;

/* Popup Meta */
font-size: 11px;
font-weight: 400;
```

---

## Spacing & Layout

### Spacing Scale
Use a consistent 4px-based spacing scale:

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

### Border Radius

```css
--radius-sm: 8px;   /* Small elements (badges, pills)
--radius-md: 12px;  /* Buttons, inputs, cards */
--radius-lg: 16px;  /* Large cards, containers */
--radius-xl: 20px;  /* Hero sections, modals */
--radius-full: 9999px; /* Pills, circular buttons */
```

### Shadows

```css
/* Subtle elevation (cards) */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);

/* Medium elevation (dropdowns, tooltips) */
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1);

/* High elevation (modals, important UI) */
--shadow-xl: 0 20px 40px rgba(15, 23, 42, 0.15);
```

### Container Widths

```css
/* Options page main content */
--container-sm: 600px;  /* Form content */
--container-md: 800px;  /* Full page content */
--container-lg: 1200px; /* Wide layouts */
```

---

## Component Styles

### Buttons

#### Primary Button
```css
.button-primary {
  background: var(--mirlo-teal-700);
  color: var(--mirlo-white);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 200ms ease;
}

.button-primary:hover {
  background: var(--mirlo-teal-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button-primary:active {
  transform: translateY(0);
}
```

#### Secondary Button
```css
.button-secondary {
  background: var(--mirlo-white);
  color: var(--mirlo-slate-700);
  padding: 12px 24px;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: 1px solid var(--mirlo-slate-200);
  cursor: pointer;
  transition: all 200ms ease;
}

.button-secondary:hover {
  border-color: var(--mirlo-slate-400);
  box-shadow: var(--shadow-sm);
}
```

### Form Inputs

#### Select Dropdown
```css
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--mirlo-slate-200);
  border-radius: var(--radius-md);
  background: var(--mirlo-white);
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  color: var(--mirlo-slate-900);
  cursor: pointer;
  transition: all 200ms ease;
}

.form-select:hover {
  border-color: var(--mirlo-slate-400);
}

.form-select:focus {
  outline: none;
  border-color: var(--mirlo-teal-700);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}
```

### Cards

```css
.card {
  background: var(--mirlo-white);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--mirlo-slate-200);
}
```

### Badges/Pills

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  background: var(--mirlo-teal-100);
  color: var(--mirlo-teal-700);
}
```

---

## Animation & Interaction

### Timing Functions

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0.0, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Transition Durations

```css
--duration-fast: 150ms;    /* Micro-interactions (hover) */
--duration-normal: 200ms;  /* Standard transitions */
--duration-slow: 300ms;    /* Smooth, noticeable */
--duration-slower: 500ms;  /* Page transitions */
```

### Animation Patterns

#### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp var(--duration-slow) var(--ease-out);
}
```

#### Success Checkmark
```css
@keyframes successPop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon {
  animation: successPop 400ms var(--ease-spring);
}
```

#### Button Press
```css
.button:active {
  transform: scale(0.98);
}
```

### Hover Effects

All interactive elements should have hover states:
- **Buttons**: Slight color change + lift (translateY)
- **Links**: Underline or color change
- **Cards**: Subtle shadow increase
- **Icons**: Scale or color change

### Accessibility

Always respect reduced motion preference:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Iconography

### Icon Style
- **Line weight**: 2px
- **Corner radius**: Slightly rounded (not sharp)
- **Size**: 20×20px or 24×24px
- **Color**: Inherit from parent or use `--mirlo-slate-400`

### Recommended Icon Sets
- [Heroicons](https://heroicons.com/) - Matches our style perfectly
- [Feather Icons](https://feathericons.com/) - Clean, minimal

### Common Icons Needed

1. **Settings/Gear** ⚙️
   - For options link in popup
   - 20×20px, stroke weight 2px

2. **Check/Checkmark** ✓
   - Success states
   - 20×20px, stroke weight 2.5px (slightly bolder)

3. **X/Close** ×
   - Dismissing messages
   - 20×20px, stroke weight 2px

4. **Arrow Right** →
   - Navigation, "next" actions
   - 20×20px, stroke weight 2px

5. **Globe** 🌐
   - Language-related actions
   - Can use emoji for now, SVG for scalability

6. **Flag Icons** 🇬🇧🇪🇸🇫🇷
   - Use emoji flags in dropdowns for simplicity
   - Alternative: [flag-icons](https://github.com/lipis/flag-icons) library

---

## Voice & Tone

### Brand Voice
- **Friendly**: "Enable Mirlo on this site?" (not "Activate extension module?")
- **Clear**: "Switch to Spanish" (not "Toggle language state")
- **Encouraging**: "Save Settings" (not "Submit")
- **Casual**: "Not now" (not "Cancel" or "Dismiss")

### Writing Guidelines

#### ✅ Do:
- Use contractions (you're, we'll, it's)
- Address the user directly (you/your)
- Keep sentences short and scannable
- Use active voice
- Add personality where appropriate

#### ❌ Don't:
- Use jargon or technical terms
- Write long paragraphs
- Use passive voice
- Sound corporate or robotic
- Over-explain simple actions

### Example Microcopy

| Context | Good ✅ | Bad ❌ |
|---------|---------|--------|
| Success message | "Settings saved!" | "Configuration has been persisted to storage" |
| Error message | "Oops! Please select different languages" | "Error: Source and target cannot be identical" |
| Empty state | "No languages selected yet" | "Configuration not found" |
| Loading state | "Saving..." | "Please wait while we process your request..." |
| Call to action | "Change languages →" | "Modify configuration parameters" |

---

## Asset Checklist

### Required Assets (High Priority)

- [ ] **mirlo-icon.svg** - Simplified SVG icon (128×128px)
- [ ] **mirlo-wordmark.svg** - Logo with text (width ~300px)
- [ ] **mirlo-badge-icon.svg** - Ultra-simple bird for inline badge (32×32px)
- [ ] **mirlo-hero-banner.png** - Wide banner with gradient (1200×400px)

### Nice-to-Have Assets (Medium Priority)

- [ ] **mirlo-social-preview.png** - Chrome Web Store preview (1280×640px)
- [ ] **settings-icon.svg** - Gear icon for popup (20×20px)
- [ ] **check-icon.svg** - Success checkmark (20×20px)
- [ ] **arrow-right-icon.svg** - Navigation arrow (20×20px)

### Future Assets (Low Priority)

- [ ] **mirlo-dark-mode.svg** - Logo variant for dark backgrounds
- [ ] **mirlo-animated.gif** - Animated bird for marketing (optional)
- [ ] **tutorial-screenshots/** - Onboarding images
- [ ] **app-store-screenshots/** - Chrome Web Store listing images

---

## Design System CSS Variables

Complete CSS custom properties for implementation:

```css
:root {
  /* Colors - Primary */
  --mirlo-teal-700: #0f766e;
  --mirlo-teal-600: #0d9488;
  --mirlo-teal-100: #ccfbf1;
  --mirlo-orange-500: #f97316;
  --mirlo-orange-400: #fb923c;
  --mirlo-orange-100: #ffedd5;

  /* Colors - Neutrals */
  --mirlo-slate-900: #0f172a;
  --mirlo-slate-700: #334155;
  --mirlo-slate-400: #94a3b8;
  --mirlo-slate-200: #e2e8f0;
  --mirlo-slate-100: #f1f5f9;
  --mirlo-white: #ffffff;

  /* Colors - Semantic */
  --mirlo-green-600: #059669;
  --mirlo-green-100: #d1fae5;
  --mirlo-red-600: #dc2626;
  --mirlo-red-100: #fee2e2;
  --mirlo-blue-600: #2563eb;
  --mirlo-blue-100: #dbeafe;

  /* Typography */
  --font-heading: 'Manrope', system-ui, -apple-system, sans-serif;
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 40px rgba(15, 23, 42, 0.15);

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0.0, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #0f766e 0%, #2dd4bf 50%, #f97316 100%);
  --gradient-subtle: linear-gradient(135deg, #f0fdfa 0%, #fff7ed 100%);
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
```

### Options Page Responsive Behavior

```css
/* Mobile (< 640px) */
- Hero banner: 160px height
- Hero title: 32px font size
- Card padding: 24px
- Button: Full width

/* Tablet (640px - 1024px) */
- Hero banner: 200px height
- Hero title: 48px font size
- Card padding: 32px
- Button: Full width

/* Desktop (> 1024px) */
- Hero banner: 240px height
- Hero title: 56px font size
- Card padding: 40px
- Button: Auto width (but min 200px)
```

---

## Chrome Web Store Presence

When ready to publish, follow these guidelines:

### Store Listing Design
- **Screenshots**: Clean, high-quality (1280×800px)
- **Promotional tile**: 440×280px, use brand gradient
- **Marquee image**: 1400×560px, hero banner with device mockup

### Store Description Tone
Match our brand voice:
- Start with a hook: "Learn Spanish naturally while browsing the web"
- Focus on benefits, not features
- Keep it scannable with bullet points
- Include clear call-to-action

---

## Design Principles

1. **Clarity over Cleverness**: Always prioritize understanding over aesthetics
2. **Consistency over Novelty**: Use established patterns, don't reinvent
3. **Delight in Details**: Smooth animations, perfect spacing, polish
4. **Accessibility First**: Color contrast, keyboard navigation, screen readers
5. **Progressive Enhancement**: Work without JS, enhance with it

---

## Questions?

If you need clarification on any brand element:
1. Check this document first
2. Look at existing UI (popup, content script) for reference
3. Browse Toucan and Duolingo for inspiration
4. When in doubt: simpler and cleaner is better

Remember: **Mirlo is playful, not childish; modern, not trendy; friendly, not unprofessional.**

🐦 Happy designing!
