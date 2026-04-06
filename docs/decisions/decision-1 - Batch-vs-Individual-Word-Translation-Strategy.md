---
id: decision-1
title: Batch vs Individual Word Translation Strategy
date: '2026-03-21 16:54'
status: investigating
---
## Context

Chrome's Translator API produces poor translations for isolated common English words. Modal verbs are the worst: "cannot"→"porque", "can"→"lata", "will"→"voluntad". The API treats single words as nouns/literals instead of their most common usage.

When words are sent in a pipe-delimited batch string (e.g. "I | cannot | go"), surrounding context helps the model pick the right meaning. But pipe counts in the response don't always match the input, making it unreliable to split results back to individual words.

**TASK-21** switched from batch to individual calls to fix the pipe-count mismatch problem. **TASK-26** proposes trying batch first and falling back to individual if pipe counts don't match. Before building that, we need data.

### Observed problem (anecdotal)

| Word | Individual | Batch (with context) |
|------|-----------|---------------------|
| cannot | porque | no puede |
| can | lata | puede |
| will | voluntad | voluntad |
| may | mayo | puede |

### Questions to answer

1. How often does the pipe count match for a realistic word list?
2. For words where both methods succeed, how often are translations different?
3. When they differ, is batch consistently better?

## Spike

Script: `spikes/batch-vs-individual-translation.js`
Run in Chrome DevTools on any English page with Translator API enabled.

### Results (2026-03-21)

Tested 35 words (modal verbs, common verbs, nouns, adjectives) on an English page, en→es.

**Pipe count:** Matched (35 in, 35 out). No mismatch for this word set.

**Overall:** 8 identical, 27 different. But most differences are superficial:

- ~13 are **capitalization only** (batch capitalizes: casa→Casa, ventana→Ventana, etc.)
- 4 are **batch clearly better** (context helps pick the right meaning)
- 3 are **individual clearly better** (batch garbles or returns empty)
- ~7 are **toss-ups** (gender variation, both-wrong, or synonym-level differences)

**Batch wins:**

| Word | Individual | Batch |
|------|-----------|-------|
| cannot | porque | no puede |
| running | funcionamiento | Corriendo |
| working | funcionamiento | Trabajando |
| learning | aprendizaje | Aprendiendo |

**Individual wins:**

| Word | Individual | Batch |
|------|-----------|-------|
| would | sería | _(empty string)_ |
| might | podrían | poder |
| should | deberían | DEBE |

**Key observations:**
1. Batch returned an empty string for "would" — a showstopper for display.
2. Batch capitalizes most words, requiring normalization for inline display.
3. Neither method is reliable for modal verbs. Both produce wrong results for different words.
4. For nouns and adjectives, both methods produce acceptable translations.

## Decision

**Don't build batch-first-with-fallback (TASK-26).** The data doesn't support it.

- Batch is not consistently better. It fixes 4 words but breaks 3 others.
- The empty-string failure mode is worse than a bad translation — it would blank out a word on the page.
- Capitalization normalization adds complexity for marginal gain.
- The pipe-count matching worked here, but one test doesn't prove reliability across languages and word counts.

**Instead:** Keep individual translation. Improve quality by adding problem words (modal verbs, gerunds that get noun-ified) to the stopword list so they're skipped rather than mistranslated. A wrong translation is worse than no translation.

## Consequences

- TASK-26 should be closed or rewritten as a stopword-list improvement task.
- TASK-25 (report bugs to Google) becomes more important — the root cause is the API, not our approach.
- The stopword list in `word-replacement.ts` should be expanded to cover words where individual translation is known-bad._
