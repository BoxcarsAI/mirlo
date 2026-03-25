# Mirlo Marketing Guide

Last updated: 2026-03-25

## Store Title

**Mirlo — Language Learning Without the Tracking**

## The Story

Bundle learning a language into something you already do — browsing the web. That's the pitch, and it works. Toucan proved it with 750,000 users.

But every tool that does this sends what you're reading to the cloud. Your text goes up, the translation comes back, and along the way you've shared what you read, when, and where with a company that could sell or lose that data.

In 2026, Chrome built an AI Translator API right into the browser. Mirlo is built on it. Translation happens on your device, and nothing leaves your computer. This isn't a privacy policy — it's the architecture.

---

## Positioning Statement

**Learn a language while you browse — nothing leaves your computer.**

Mirlo replaces words on web pages with translations in your target language, so you pick them up as you read. All translation happens locally using Chrome's built-in AI. No accounts. No tracking. No servers.

---

## Who This Is For

### The Ideal User

Someone who reads on the web in a second language and wants lightweight, ambient help — not another app to manage.

**Behaviors:**
- Reads articles, blogs, or social media in a language they're learning or maintaining
- Prefers passive absorption over active study sessions
- Installs tools and expects them to work — won't create an account for a browser extension
- Notices when something is tracking them and cares enough to look for alternatives

**Skill range:** The density control (Low / Medium / High) makes Mirlo useful across proficiency levels. A beginner on Low sees 1-2 translated words per paragraph — enough for exposure without overwhelm. An advanced reader on High gets dense immersion. The tool adapts; the user doesn't need to self-assess their CEFR level.

**What they're not looking for:**
- Structured lessons, homework, or streaks
- Gamification (quizzes, points, achievements)
- Full-page translation (that's Google Translate)
- Conversation practice or AI tutoring

### Why They'd Choose Mirlo Over Alternatives

| Alternative | Why they leave | Why Mirlo fits |
|---|---|---|
| **Toucan** | Requires account + email before you can try it. Collects clickstream data, shares with analytics/ad partners. Adding quizzes and gamification — becoming an app, not a tool. | Install and go. No signup. Nothing leaves your device. |
| **Immersive Translate** | Major privacy breach (Aug 2025) — user data leaked to public cloud storage. Freemium with $7-10/mo premium. Tried to restrict third-party API access. | No servers to breach. Free forever. Open source. |
| **Google Translate** | Translates entire pages. Useful for comprehension, useless for learning — you never engage with individual words. | Selective word replacement forces you to read in context. |
| **Duolingo / Babbel** | Great for beginners. Not designed for reading real content on the open web. | Works on any website you already read. |

---

## Value Proposition

Three claims, in order of importance:

### 1. Nothing leaves your computer

Every other word-level translation extension sends your text to a server. Mirlo uses Chrome's built-in Translator API — translation happens on your device. No network requests, no accounts, no data collection. This isn't a policy; it's how the software works. Open source, so you can verify it.

### 2. Install and start reading

No signup. No onboarding wizard. No email. Pick your languages, set your density, and browse. Words appear translated inline with a hover tooltip showing the original. Click any paragraph's badge to see the full translation.

### 3. You control the intensity

The density slider determines how many words get translated: Low (~8%), Medium (~25%), High (~50%). Start gentle and increase as you get comfortable — or drop it low on days when you just want to read without thinking too hard.

---

## Competitive Landscape

See [competitive.md](competitive.md) for detailed analysis. The short version:

- **Toucan** is the direct competitor and category leader (750K users). Actively maintained, 12+ languages. But cloud-dependent, requires account, collects user data.
- **Immersive Translate** is the largest player (20M+ users) but had a serious privacy incident in 2025 and faces trust issues.
- **Fluent** does word replacement but is small, ad-supported, planning a Pro tier.
- **Nobody** does word-level contextual translation with local AI. That's the gap.

---

## Messaging

### The Story Arc

The store copy, README, and any long-form content follow this structure:

1. **Start with the aspiration.** Learning a language while you browse is a great idea — bundle it into something you already do.
2. **Name the catch.** Every tool that does this sends your reading to the cloud. That's how you end up with accounts, tracking, and privacy policies.
3. **Explain what changed.** Chrome built an on-device Translator API. No server needed.
4. **Land it.** This isn't a privacy policy — it's the architecture. No servers. No accounts. No tracking.

### Key Messages

- **Lead:** "Learn a language while you browse — nothing leaves your computer."
- **How it works:** "Mirlo replaces words on web pages with translations in your target language. Hover to see the original. All translation happens locally."
- **Why now:** "Chrome's built-in Translator API makes on-device translation possible for the first time. No servers needed."
- **Trust:** "Open source, no accounts, no tracking — verify it yourself."
- **Simplicity:** "It does one thing well: words on a page, translated while you read."

### What Not to Say

- Don't call it "revolutionary" or "game-changing." It's a browser extension.
- Don't attack competitors by name in store copy. State what Mirlo does; let users draw comparisons.
- Don't gatekeep by proficiency level. The density control handles this.
- Don't promise fluency. Mirlo builds vocabulary through exposure — one piece of a larger learning practice.
- Don't oversell the AI angle. "Local AI" is the mechanism, not the selling point. Privacy and simplicity are the selling points.

---

## Tone & Voice

**Say what it does. Skip the fanfare.**

Mirlo's copy should feel like the person who built it is telling you about it — not selling it. State what it does. Explain why it works the way it does. Be honest about limitations. Let the architecture speak for itself.

- **Not:** "Finally, a revolutionary way to learn languages!"
- **Is:** "Words get replaced as you read. Hover to see the original. Everything happens on your device."

- **Not:** "Trusted by thousands of privacy-conscious learners!"
- **Is:** "Open source. No accounts. No servers. Check the code yourself."

- **Not:** "Mirlo is the ONLY extension that..."
- **Is:** "Chrome's Translator API runs on-device. Mirlo is built on it."

Short paragraphs. Plain language. No emoji section headers in store copy — they signal "this was written by a marketer," which is the opposite of our voice.

---

## Channel Strategy

### Chrome Web Store
**The listing does the heavy lifting.** Most users discover extensions through CWS search. The summary (132 chars) and first paragraph of the description determine whether someone installs.

**Keywords to target:** language learning, vocabulary, translate while browsing, private translation, local translation, no tracking

### Reddit
**Communities:** r/languagelearning, r/LearnSpanish, r/LearnFrench, r/German, r/privacy, r/degoogle, r/chrome

**Approach:** Share genuinely, as a builder. "I built this for my own learning and thought others might find it useful." Don't lead with privacy — lead with the use case, mention privacy as a natural feature.

### Hacker News
**Angle:** The technical story. Chrome's Translator API, local AI, what it enables. HN cares about the "how" and "why" more than the product pitch.

### Language Learning Blogs / YouTubers
**Angle:** "New category of tool — word-level translation that runs entirely in your browser." Offer to let them try it. The density control is a natural demo moment.

### Privacy Communities
**Angle:** Architecture, not policy. Explain why local AI is structurally different from a privacy promise. Link to source code.

---

## FAQ (Messaging Guidance)

### "Is this for beginners?"
"Mirlo works across skill levels. The density control lets you choose how many words get translated — Low replaces about 1 in 12 words, High replaces about 1 in 2. Start wherever you are."

### "Why only 3 language pairs?"
"We're starting with English, Spanish, French, and German because they work reliably with Chrome's local Translator API. More languages as Chrome expands support."

### "Is it really free?"
"Free and open source. No premium tier, no subscriptions, no ads. The code is on GitHub."

### "How is this different from Google Translate?"
"Google Translate replaces the whole page. You read in English and learn nothing. Mirlo replaces individual words so you read in your target language with selective help — you learn from context."

### "How is this different from Toucan?"
"Toucan sends your text to their servers for translation. Mirlo uses Chrome's built-in Translator API — everything happens on your device. No account needed, no data collected."

### "Why should I trust this?"
"You don't have to trust us. The code is open source — read it. And because translation happens locally in Chrome, there's no server we could send your data to even if we wanted to."

---

## Success Metrics

1. **Install-to-active ratio:** Do people who install keep using it? High ratio = the product delivers on the promise.
2. **Organic mentions:** Are people recommending it in language learning communities without being asked?
3. **Privacy as cited reason:** When people share Mirlo, do they mention the local/private aspect?
4. **No-churn simplicity:** Are people confused by the tool, or does it just work?

---

## Store Privacy Tab

All translation happens on your device using Chrome's Translator API. No servers, no accounts, no data collection.

**activeTab** — Required to access the page you're reading so Mirlo can translate words on it. No background access.

**scripting** — Required to inject translated words and hover tooltips into the page.

**storage** — Required to remember your language preferences locally. No cloud storage, no accounts.

**host** — Mirlo works on any website you choose to read. Host access lets the content script run on whatever site you visit. No tracking or data collection.

https://www.boxcars.ai/mirlo-privacy-policy/
