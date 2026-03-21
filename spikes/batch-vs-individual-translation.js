/**
 * Spike: Batch vs Individual Word Translation Quality
 *
 * Run this in Chrome DevTools console on any English page where the
 * Translator API is available (chrome://flags → #translation-api → Enabled).
 *
 * Tests a list of common English words translated to Spanish via:
 *   1. Individual calls (one word at a time)
 *   2. Batch call (pipe-delimited string, split on pipes after)
 *
 * Outputs a comparison table + summary stats.
 */

(async function batchVsIndividualSpike() {
  const SOURCE = "en";
  const TARGET = "es";

  // Mix of word types: modal verbs (known problem), common verbs, nouns, adjectives
  const TEST_WORDS = [
    // Modal verbs (known bad in individual mode)
    "cannot", "could", "should", "might", "would",
    // Common verbs
    "running", "eating", "thinking", "playing", "writing",
    "building", "learning", "reading", "speaking", "working",
    // Nouns
    "house", "water", "friend", "morning", "kitchen",
    "market", "garden", "window", "bridge", "forest",
    // Adjectives
    "beautiful", "difficult", "important", "dangerous", "interesting",
    "comfortable", "different", "possible", "necessary", "wonderful",
  ];

  console.log(`Creating translator: ${SOURCE} → ${TARGET}`);
  const translator = await Translator.create({
    sourceLanguage: SOURCE,
    targetLanguage: TARGET,
  });

  // Individual translations
  console.log("Translating individually...");
  const individual = {};
  for (const word of TEST_WORDS) {
    individual[word] = (await translator.translate(word)).trim();
  }

  // Batch translation (pipe-delimited)
  console.log("Translating as batch...");
  const batchInput = TEST_WORDS.join(" | ");
  const batchRaw = await translator.translate(batchInput);
  const batchParts = batchRaw.split("|").map(s => s.trim());

  const pipeCountMatch = batchParts.length === TEST_WORDS.length;
  console.log(`\nPipe count: input=${TEST_WORDS.length}, output=${batchParts.length}, match=${pipeCountMatch}`);

  // Build comparison
  const results = TEST_WORDS.map((word, i) => ({
    word,
    individual: individual[word],
    batch: pipeCountMatch ? batchParts[i] : "N/A (count mismatch)",
    same: pipeCountMatch ? individual[word] === batchParts[i] : null,
  }));

  // Summary
  const diffCount = results.filter(r => r.same === false).length;
  const sameCount = results.filter(r => r.same === true).length;

  console.log("\n=== RESULTS ===\n");
  console.table(results);

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total words: ${TEST_WORDS.length}`);
  console.log(`Pipe count matched: ${pipeCountMatch}`);
  console.log(`Same translation: ${sameCount}`);
  console.log(`Different translation: ${diffCount}`);

  if (diffCount > 0) {
    console.log(`\n=== DIFFERENCES ===`);
    console.table(results.filter(r => r.same === false));
  }

  // Return structured data for easy copy-paste
  return { pipeCountMatch, results, sameCount, diffCount };
})();
