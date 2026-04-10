/**
 * HTML fixtures for word segmentation and replacement tests.
 * Each fixture includes the HTML string and expected word count.
 */

/** Plain text, no nested elements */
export const PLAIN_PARAGRAPH =
  "<p>The quick brown fox jumps over the lazy dog near the river bank</p>";

/** Bold and italic inline elements */
export const NESTED_INLINE =
  "<p>She walked to the <strong>old library</strong> and found a <em>beautiful</em> book inside</p>";

/** Link wrapping multiple words */
export const WITH_LINK =
  '<p>Read the <a href="/article">full article about language learning</a> for more details</p>';

/** Deeply nested: bold inside a link */
export const DEEPLY_NESTED =
  '<p>Visit the <a href="/blog"><strong>official blog</strong> for updates</a> on the project</p>';

/** Multiple inline elements in sequence */
export const MIXED_INLINE =
  "<p>The <strong>brave</strong> and <em>clever</em> students <span>passed</span> every test</p>";

/** Single word paragraph (edge case) */
export const SINGLE_WORD = "<p>Hello</p>";

/** Paragraph with punctuation attached to words */
export const WITH_PUNCTUATION =
  "<p>Well, the students asked: why? Because learning matters—always.</p>";

/** Paragraph with existing mirlo-badge (should be excluded) */
export const WITH_BADGE =
  '<p>Some translated text <span class="mirlo-badge">badge</span></p>';

/** Paragraph already segmented (idempotency check) */
export const ALREADY_SEGMENTED =
  '<p><span class="mirlo-word" data-mirlo-original="Hello">Hello</span> <span class="mirlo-word" data-mirlo-original="world">world</span></p>';

/** Empty paragraph */
export const EMPTY_PARAGRAPH = "<p></p>";

/** Paragraph with repeated words (for dedup testing) */
export const REPEATED_WORDS =
  "<p>The cat sat on the mat and the cat looked at the other cat nearby</p>";

/** Paragraph with mix of simple and complex words */
export const MIXED_COMPLEXITY =
  "<p>The extraordinary architecture of the ancient cathedral impressed all the international visitors who traveled there</p>";

/** Proper noun mid-sentence (should be skipped) */
export const PROPER_NOUN_MID_SENTENCE =
  "<p>She met Maria at the coffee shop downtown yesterday</p>";

/** Proper noun at sentence start (cannot distinguish from regular word) */
export const PROPER_NOUN_SENTENCE_START =
  "<p>Maria walked to the store and bought some bread</p>";

/** Multiple proper nouns scattered through sentence */
export const MULTIPLE_PROPER_NOUNS =
  "<p>Yesterday John and Maria visited the Eiffel Tower in Paris</p>";

/** Second sentence starts with proper noun */
export const PROPER_NOUN_AFTER_PERIOD =
  "<p>The weather was lovely. Maria walked to the store and picked some flowers.</p>";
