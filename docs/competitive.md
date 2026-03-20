# Competitive Landscape

Last updated: 2026-03-20

## Direct Competitor: Toucan (by Babbel)

Acquired by Babbel September 2023. Replaces words on web pages with target-language translations. Free but increasingly a Babbel upsell funnel. 12 languages only. Users report reliability bugs and stagnating development post-acquisition. Chrome/Edge only.

**Mirlo's angle**: Open-source, local AI (no cloud), no upsell, extensible language support.

## Major Players

| Extension | Model | Users | Gap |
|-----------|-------|-------|-----|
| **Immersive Translate** | Freemium ($7-10/mo) | 20M+ | Highest permissions of any translator (Incogni 2026 study). Cloud-dependent. Closed source. |
| **Language Reactor** | Freemium | Large | Netflix/YouTube only. No general web browsing. |
| **Mate Translate** | Paid ($3.99+) | Moderate | General translation, not learning-focused. |
| **Readlang** | Freemium | Moderate | Click-to-translate + flashcards. Reading-focused niche. |

## Privacy-Oriented / Local AI

| Extension | Notes |
|-----------|-------|
| **Linguist** | Offline translation, privacy-first. No learning features. |
| **Read Frog** | Open-source Immersive Translate alternative. Bilingual reading, not vocabulary acquisition. |
| **translate-browser-extension** (GitHub) | OPUS-MT via WASM. 1 star. Very early stage. |

## Chrome Translator API (our foundation)

Generally available since Chrome 138. On-device, no data leaves browser. Steep system requirements: 22GB disk, 16GB RAM or 4GB VRAM. Desktop only. Sequential processing (no parallel batch).

**Implication**: Works great for paragraph/word-level translation on modern machines. Need to handle graceful degradation for users who don't meet requirements.

## The Gap We Own

Privacy-respecting contextual language learning while browsing the open web. Toucan owns this UX pattern but is closed-source, limited, and becoming an upsell vehicle. Chrome's Translator API makes it technically feasible to replicate locally. Nobody has built the learning layer on top of it yet.
