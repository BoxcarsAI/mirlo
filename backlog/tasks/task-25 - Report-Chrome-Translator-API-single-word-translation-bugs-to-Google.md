---
id: TASK-25
title: Report Chrome Translator API single-word translation bugs to Google
status: To Do
assignee: []
created_date: '2026-03-21 09:15'
updated_date: '2026-03-21 16:58'
labels:
  - dev
dependencies: []
references:
  - spikes/batch-vs-individual-translation.js
  - >-
    backlog/decisions/decision-1 -
    Batch-vs-Individual-Word-Translation-Strategy.md
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Chrome Translator API produces incorrect translations for many common English words when translated individually (without sentence context). This affects any application using the API for word-level translation.

### Evidence from spike (2026-03-21)

Tested 35 English words translated to Spanish (en→es) via `Translator.create()`. Compared individual word translation vs pipe-delimited batch translation where surrounding words provide context.

Spike script: `spikes/batch-vs-individual-translation.js`
Decision record: `backlog/decisions/decision-1`

### Worst failures (individual word translation)

| Word | Got | Expected | Category |
|------|-----|----------|----------|
| cannot | porque (because) | no puede | Modal verb |
| running | funcionamiento (functioning) | corriendo | Gerund→noun |
| working | funcionamiento (functioning) | trabajando | Gerund→noun |
| learning | aprendizaje (the learning) | aprendiendo | Gerund→noun |
| speaking | hablante (speaker) | hablando | Gerund→noun |
| building | edificio (building/noun) | construyendo | Gerund→noun |

### Pattern

The API consistently interprets isolated words as nouns rather than their most common verb usage. Gerunds (-ing words) are translated as abstract nouns instead of progressive verb forms. Modal verbs get nonsensical translations.

### Batch comparison shows the model CAN get it right

When the same words are sent in a pipe-delimited string with neighbors providing context, most of these translate correctly (e.g. "cannot"→"no puede", "running"→"Corriendo"). This suggests the underlying model handles these words fine — the issue is how isolated single-word input is processed.

### Reproduction

1. Enable `chrome://flags/#translation-api`
2. Open DevTools console on any page
3. Run:
```js
const t = await Translator.create({ sourceLanguage: "en", targetLanguage: "es" });
console.log(await t.translate("cannot"));  // "porque"
console.log(await t.translate("running")); // "funcionamiento"
```

### Impact

This makes the Translator API unsuitable for word-level translation use cases (language learning tools, vocabulary builders, inline word replacement). The API works well for sentences and paragraphs but fails for the single-word case.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Bug report filed with Google (Chromium bug tracker)
- [ ] #2 Test cases documented with individual vs sentence-level comparison
<!-- AC:END -->
