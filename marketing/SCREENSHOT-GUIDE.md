# Screenshot Guide for Chrome Web Store

Last updated: 2026-03-25

## Current Screenshot Set (4 images, 1280x800)

1. **Hero** — Bird + "Learn a language while you browse / Without sharing your browsing history"
2. **Product** — Real NYT article with translated words and tooltip visible, floating on teal
3. **Density comparison** — Same article at Low vs High density, side by side
4. **Setup** — Options page floating on teal, "Install. Pick your languages. Start reading."

Plus two promotional tiles:
- **Marquee** (1400x560) — Bird + headline, same visual language as hero
- **Small promo** (440x280) — Bird + "Mirlo" + tagline

## How We Build Screenshots

### The workflow: you capture, Remotion frames

1. **Take clean browser screenshots** — no annotations, no circles, no zoom callouts. Just the browser as it looks with Mirlo active.
2. **Drop them in** `~/dev/mandalivia/remotion/public/mirlo/`
3. **Remotion compositions** in `~/dev/mandalivia/remotion/src/mirlo-store-v2/` handle the visual framing: teal gradient background, white header text, drop shadow on the screenshot, any zoom callouts.
4. **Render** with `npx remotion still <CompositionId> --output path/to/file.png`
5. **Copy finals** to `marketing/screenshots/en/`

This separation works well. You control the content (what article, what state, what's visible). Remotion controls the presentation (consistent teal gradient, typography, layout). Changing the message text doesn't require new screenshots, and new screenshots don't require redesigning the frame.

### Remotion project structure

```
~/dev/mandalivia/remotion/
  src/mirlo-store-v2/
    HeroScreenshot.tsx    — Screenshot 1: bird + headline (no browser screenshot)
    Screen2_WordsTranslate.tsx — Screenshot 2: article with translations
    Screen4_DensityControl.tsx — Screenshot 3: low vs high density side-by-side
    Screen5_Setup.tsx     — Screenshot 4: options page
    MarqueeTile.tsx       — 1400x560 marquee banner
    PromoTile.tsx         — 440x280 small promo tile
    shared.tsx            — Reusable components (ScreenFrame, FloatingScreenshot, ZoomCallout)
  src/mirlo-store/
    Composition.tsx       — v1 screenshots (archived, not used)
  public/mirlo/
    mirlo-circle.png      — Bird in circular frame (used in hero, marquee, promo)
    screen2.png           — NYT article with tooltip visible
    lowdensity.png        — Same article at Low density
    highdensity.png       — Same article at High density
    options-page.png      — Settings page
```

### Render commands

```bash
cd ~/dev/mandalivia/remotion

# Individual
npx remotion still MirloHero --output /tmp/hero.png
npx remotion still MirloWordsTranslate --output /tmp/words.png
npx remotion still MirloDensityControl --output /tmp/density.png
npx remotion still MirloSetup --output /tmp/setup.png
npx remotion still MirloMarquee --output /tmp/marquee.png
npx remotion still MirloPromo --output /tmp/promo.png

# Preview in browser
npx remotion studio
```

### When to re-render

- **Message text changes** — edit the TSX composition, re-render. No new screenshots needed.
- **New feature to show** — capture a new browser screenshot, drop it in `public/mirlo/`, wire it into a composition.
- **New screenshot slot** — create a new composition in `mirlo-store-v2/`, register it in `Root.tsx` as a `<Still>`.

## What Makes a Good Raw Screenshot

- **Real content** on a real site. NYT, El País, BBC Mundo, Wikipedia — recognizable publications add credibility.
- **Translated words clearly visible** — enough teal text that the effect is obvious even at thumbnail size.
- **Same article and scroll position** for comparison shots (density low vs high).
- **Clean browser chrome** — no other extensions visible, no dev tools, no personal tabs.
- **No annotations** — Remotion handles all framing, callouts, and text overlays.

## CWS Technical Requirements

- **Screenshots:** 1280x800 or 640x400, PNG or JPEG, max 16MB each, up to 5
- **Small promo tile:** 440x280
- **Marquee:** 1400x560
- **All images:** Full bleed, square corners, no padding
