---
id: TASK-29
title: Rethink marketing foundation for current feature set
status: Done
assignee:
  - '@claude'
created_date: '2026-03-23 18:26'
updated_date: '2026-03-24 17:53'
labels:
  - marketing
dependencies: []
references:
  - marketing/store-copy.md
  - docs/competitive.md
  - docs/marketing.md
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The extension has evolved significantly since the original marketing was written. The store copy, positioning, and ICP all describe a different product than what we've built. Before updating any public-facing copy, we need to redo the marketing strategy from the ground up.

### What changed

When the original marketing was written, Mirlo was a paragraph-level translation tool — click a paragraph, see the translation. The positioning was "privacy-first Toucan alternative for intermediate learners."

The product now does word-level inline translation with hover tooltips, translation density control, per-paragraph language detection, and stopword filtering. This is a fundamentally different experience — passive, ambient learning while you read, not active click-to-translate.

### Problems with current marketing

**1. Store copy describes the old product**
The hero feature in the copy is "Translate entire paragraphs" and "Click any paragraph for instant translation." The actual hero feature is now word-level inline replacement. The "How It Works" section is wrong.

**2. The ICP may have shifted**
The original ICP was "intermediate learners (B1-B2) who've outgrown beginner apps." But word-level ambient translation might appeal to a broader audience — casual learners, people maintaining a second language, even beginners who want contextual exposure. The density control (Low/Medium/High) makes this accessible across skill levels. Need to validate who actually wants this.

**3. The value proposition is undersold**
The current copy leads with "you've outgrown beginner apps" — a positioning claim. The deeper story is architectural: Chrome's local Translator API means translation happens on-device for the first time. Every previous tool needed a server, which meant accounts, tracking, and business models built around user data. Local AI eliminates that structural requirement. The privacy isn't a policy choice — it's a consequence of the architecture. This is a much stronger story than "we promise not to track you."

**4. Competitive positioning is stale**
The competitive analysis (docs/competitive.md) was written before word-level translation existed. Mirlo now has feature parity with Toucan's core mechanic. The differentiation has shifted from "we do less but privately" to "we do the same thing but locally." Need fresh competitive research — what is Toucan doing now? What do users complain about? What about Immersive Translate and other alternatives?

**5. The tone doesn't match our voice**
The store copy uses emoji section headers, bullet-point-heavy formatting, and importance inflation patterns ("Actually free forever" followed by four sentences saying the same thing). Our writing style is understated and substantive. The copy should reflect that — it would actually stand out in a store full of hyperbolic descriptions.

### What needs to happen

1. **Competitive research** — Current state of Toucan (features, pricing, reviews, complaints), Immersive Translate, and other word-level translation tools. What do real users say on Reddit, Chrome Web Store reviews, and language learning communities?

2. **ICP redefinition** — Who is the target user given the current feature set? What are their alternatives? What pain are they actually experiencing? Interview-style thinking, not assumptions.

3. **Positioning exercise** — What is the real differentiator? What is the "why now" story? If Mirlo didn't exist, what would the user do instead? What do we want to be known for?

4. **Value prop mapping** — Translate the positioning into concrete messaging. What are the 2-3 things we say? In what order? What do we prove vs. claim?

5. **Rewrite all public-facing copy** — Store listing (summary + description), README, any promotional materials. Written in our actual voice.

6. **Update screenshots if messaging changes** — The Remotion compositions in mandalivia/remotion can be re-rendered with new callout text if the framing shifts.

### References

- Current store copy: marketing/store-copy.md
- Current competitive analysis: docs/competitive.md
- Current marketing strategy: docs/marketing.md
- Writing style guide: applies across all copy
- Decision record on translation quality: backlog/decisions/decision-1
- Remotion screenshot compositions: ~/dev/mandalivia/remotion/src/mirlo-store/
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Competitive research completed (Toucan, Immersive Translate, alternatives)
- [x] #2 ICP redefined for current feature set
- [x] #3 Positioning and value props documented
- [x] #4 Store copy rewritten
- [x] #5 README updated to match new positioning
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Competitive research — web search for Toucan current state, Immersive Translate complaints, Reddit/community sentiment on browser translation tools
2. Synthesize product reality — what Mirlo actually is now vs. what the copy says
3. ICP redefinition — who wants this, validated against competitive gaps and community signals
4. Positioning & value props — the real differentiator story, messaging hierarchy
5. Rewrite store copy, update competitive doc, update marketing guide
6. Update README if positioning shifts
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Competitive research complete. Key findings:
- Toucan is NOT abandoned — 750K users, actively maintained, polished site, 12+ languages
- Toucan requires account/email, collects clickstream data, shares with analytics/ad partners
- Immersive Translate had major privacy breach Aug 2025 (user data leaked to public Tencent Cloud)
- Nobody does local-AI word-level translation — that is the gap
- User wants narrow positioning: the "architecture story" (local AI removes the server) is the lead
- Mirlo is a test bed — marketing playbook should be reusable for future local AI apps
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Rewrote the marketing foundation for Mirlo based on competitive research and the product's evolution to word-level inline translation.

Key strategic shift: the old positioning ("privacy-first Toucan alternative for intermediate learners") assumed Toucan was neglected and narrowed the audience by proficiency level. Research showed Toucan is actively maintained with 750K users — but structurally tied to cloud servers, account walls, and data collection. The new positioning leads with what changed technically (Chrome's on-device Translator API) and why that matters (no server → no account → no data → privacy by architecture).

Files updated:
- docs/marketing.md — Complete rewrite: new positioning statement, widened ICP (behavior-based, not proficiency-gated), "until now" narrative framework, competitive comparison table, channel strategy, updated FAQ and voice guidelines
- docs/competitive.md — Updated with research: Toucan active with 750K users, Immersive Translate privacy breach (Aug 2025), Fluent/Fluent Tab/Context Reader/VocabKit mapped, gap analysis (nobody does local-AI word-level translation)
- marketing/store-copy.md — New store listing: 79-char summary, plain-text description using the "until now" narrative, density control explanation, architecture-as-privacy framing, screenshot guidance notes
- README.md — Updated to match new positioning: word-level translation as the lead feature, "On-Device Translation" section explaining the architectural differentiator

Language review caught and fixed: bullet-point prose in the privacy section, "Privacy-first...powered by" cliche construction, staccato feature dump in README, significance inflation in headings.
<!-- SECTION:FINAL_SUMMARY:END -->
