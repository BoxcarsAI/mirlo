# Competitive Landscape

Last updated: 2026-03-24

## Category: Word-Level Translation While Browsing

The pattern — replace individual words on web pages with target-language translations — was pioneered by Toucan. It works: passive vocabulary exposure during normal reading, no context switch required. Every tool in this category shares the same structural dependency: a translation engine. Until Chrome's Translator API, that meant a cloud server.

## Direct Competitor: Toucan (by Babbel)

Acquired by Babbel September 2023. 750,000+ users. Actively maintained (last update July 2025). 12+ languages. Chrome/Edge only — dropped Firefox and Safari post-acquisition.

**What they do well:**
- Polished product with smooth UX
- Quizzes, progress tracking, achievements — full learning app experience
- Wide language selection including Arabic, Chinese, Korean, Hebrew, Hindi
- Well-designed onboarding and homepage

**Structural problems they can't easily fix:**
- **Requires account creation with email** before you can even preview the extension
- **Cloud-dependent translation** — text leaves your browser
- **Privacy policy contradicts privacy claims.** They say "we don't track your browsing" but collect clickstream data (clicks, mouse position, scroll, keystroke logging), IP addresses, device/browser type, and share with analytics providers, email marketing services, and ad partners via Google Analytics
- **Babbel's business model** creates gravitational pull toward upsells and data monetization, even if current product isn't aggressive about it yet

**What users complain about:**
- Can't try before creating account
- Language randomly assigned on signup; errors when changing
- Settings panel frequently won't open
- Account deletion confusing — redirects to Babbel site
- Only supports Spain Spanish, not Latin American Spanish

**Mirlo's differentiation:** No account, no server, no data collection. Install and go. Architecture eliminates the privacy problem rather than promising around it.

## Major Players

### Immersive Translate
- **Scale:** 20M+ users. Largest translation extension.
- **Model:** Freemium ($7-10/month). Supports multiple translation backends (DeepL, Google, OpenAI, etc.).
- **Focus:** Full-page bilingual reading, PDF translation, video subtitles. Not word-level learning — full translation with side-by-side view.
- **Privacy incident (August 2025):** Webpage snapshot feature leaked user data to publicly accessible Tencent Cloud storage. Exposed: business contracts, ID numbers, crypto recovery phrases, research papers. Search engines indexed the files. Community backlash intense. Team apologized, blamed "anxiety under growth pressure."
- **Also controversial:** Tried to ban third-party translation APIs (users saw it as commercially motivated), then reversed.
- **Incogni 2026 study:** Highest permissions of any translator extension.
- **Mirlo's angle:** Different category (learning vs. comprehension), and the privacy breach makes "trust us" positioning harder for any cloud-dependent competitor.

### Fluent
- Word-replacement mechanic similar to Toucan. 250K+ word translations. Supports Spanish, French, Italian, English, German, Portuguese.
- Free, planning Pro version with ads.
- Small user base. Early stage.
- Cloud-dependent.

### Fluent Tab (Firefox)
- Built by a developer after Toucan dropped Firefox support. Replicates Toucan's core mechanic for Firefox.
- 11 languages. Includes progress tracking.
- Demonstrates unmet demand from Toucan's platform abandonment.

### Language Reactor
- Freemium. Netflix/YouTube subtitle enhancement. No general web browsing.
- Different use case — video, not reading.

### Readlang
- Freemium. Click-to-translate + flashcards. Reading-focused.
- Requires cloud translation. Account required.

### Context Reader
- Context-aware single-word translation. Claims no data collection.
- Not learning-focused — translation aid only.

### VocabKit
- Instant translations + vocabulary builder on any website.
- Select-to-translate model (active, not ambient).

## Privacy-Oriented / Local Options

| Extension | Notes |
|-----------|-------|
| **Linguist** | Offline translation, privacy-first. No learning features. Translation tool, not vocabulary builder. |
| **Read Frog** | Open-source Immersive Translate alternative. Bilingual reading. Not word-level. |
| **translate-browser-extension** (GitHub) | OPUS-MT via WASM. 1 star. Very early stage. |

None of these do word-level contextual replacement with local AI.

## Chrome Translator API

Generally available since Chrome 138. On-device, no data leaves browser.

**System requirements:** 22GB disk, 16GB RAM or 4GB VRAM. Desktop only.

**Capabilities:** Supports language pair creation (source → target), sequential processing. Quality is good for common European languages, weaker for individual words out of context (known issues with modal verbs, gerunds).

**Implication:** Mirlo is viable on modern desktop machines. Mobile and low-spec machines are out of scope for now. Need graceful degradation messaging for users who don't meet requirements.

## The Gap

Nobody does word-level contextual vocabulary translation with on-device AI. Every existing tool in this category sends text to a server. Chrome's Translator API closes that gap technically; Mirlo closes it as a product.
