// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import {
  hasOgArticleMeta,
  hasArticleSchema,
  urlLooksLikeArticle,
  isVisibleElement,
  hasParagraphHeuristic,
  isArticleLike,
} from "@/utils/article-detection";

function clearHead() {
  document.head.innerHTML = "";
}

function clearBody() {
  document.body.innerHTML = "";
}

function longText(words = 20): string {
  return Array.from({ length: words }, (_, i) => `word${i}`).join(" ");
}

describe("hasOgArticleMeta", () => {
  beforeEach(clearHead);

  it("returns true when og:type is article", () => {
    document.head.innerHTML = '<meta property="og:type" content="article">';
    expect(hasOgArticleMeta()).toBe(true);
  });

  it("returns true with mixed case", () => {
    document.head.innerHTML = '<meta property="og:type" content="Article">';
    expect(hasOgArticleMeta()).toBe(true);
  });

  it("returns false when og:type is website", () => {
    document.head.innerHTML = '<meta property="og:type" content="website">';
    expect(hasOgArticleMeta()).toBe(false);
  });

  it("returns false when no og:type meta exists", () => {
    expect(hasOgArticleMeta()).toBe(false);
  });

  it("returns false when content is empty", () => {
    document.head.innerHTML = '<meta property="og:type" content="">';
    expect(hasOgArticleMeta()).toBe(false);
  });
});

describe("hasArticleSchema", () => {
  beforeEach(clearHead);

  it("detects Article @type", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{"@type": "Article"}</script>
    `;
    expect(hasArticleSchema()).toBe(true);
  });

  it("detects NewsArticle @type", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{"@type": "NewsArticle"}</script>
    `;
    expect(hasArticleSchema()).toBe(true);
  });

  it("detects BlogPosting @type", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{"@type": "BlogPosting"}</script>
    `;
    expect(hasArticleSchema()).toBe(true);
  });

  it("detects @type in array format", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{"@type": ["WebPage", "Article"]}</script>
    `;
    expect(hasArticleSchema()).toBe(true);
  });

  it("detects article in JSON-LD array", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">[{"@type": "Organization"}, {"@type": "NewsArticle"}]</script>
    `;
    expect(hasArticleSchema()).toBe(true);
  });

  it("returns false for non-article types", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{"@type": "Organization"}</script>
    `;
    expect(hasArticleSchema()).toBe(false);
  });

  it("returns false with no ld+json scripts", () => {
    expect(hasArticleSchema()).toBe(false);
  });

  it("handles malformed JSON gracefully", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{not valid json</script>
    `;
    expect(hasArticleSchema()).toBe(false);
  });

  it("handles empty script content", () => {
    document.head.innerHTML = `
      <script type="application/ld+json"></script>
    `;
    expect(hasArticleSchema()).toBe(false);
  });
});

describe("urlLooksLikeArticle", () => {
  it("detects /article/ in path", () => {
    expect(urlLooksLikeArticle("/2024/article/some-title")).toBe(true);
  });

  it("detects /post/ in path", () => {
    expect(urlLooksLikeArticle("/post/my-post")).toBe(true);
  });

  it("detects /blog/ in path", () => {
    expect(urlLooksLikeArticle("/blog/hello-world")).toBe(true);
  });

  it("detects /news/ in path", () => {
    expect(urlLooksLikeArticle("/news/breaking")).toBe(true);
  });

  it("detects /story/ in path", () => {
    expect(urlLooksLikeArticle("/story/long-read")).toBe(true);
  });

  it("returns false for non-article paths", () => {
    expect(urlLooksLikeArticle("/about")).toBe(false);
    expect(urlLooksLikeArticle("/contact")).toBe(false);
    expect(urlLooksLikeArticle("/")).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(urlLooksLikeArticle("/Blog/Some-Post")).toBe(true);
    expect(urlLooksLikeArticle("/NEWS/item")).toBe(true);
  });
});

describe("isVisibleElement", () => {
  beforeEach(clearBody);

  it("returns false for null-ish element", () => {
    expect(isVisibleElement(null as unknown as Element)).toBe(false);
  });

  it("returns false for element inside nav", () => {
    document.body.innerHTML = "<nav><p>Text</p></nav>";
    const p = document.querySelector("p")!;
    expect(isVisibleElement(p)).toBe(false);
  });

  it("returns false for element inside footer", () => {
    document.body.innerHTML = "<footer><p>Text</p></footer>";
    const p = document.querySelector("p")!;
    expect(isVisibleElement(p)).toBe(false);
  });

  it("returns false for element inside aside", () => {
    document.body.innerHTML = "<aside><p>Text</p></aside>";
    const p = document.querySelector("p")!;
    expect(isVisibleElement(p)).toBe(false);
  });

  it("returns false for element inside .sidebar", () => {
    document.body.innerHTML = '<div class="sidebar"><p>Text</p></div>';
    const p = document.querySelector("p")!;
    expect(isVisibleElement(p)).toBe(false);
  });

  it("returns false for element inside .comments", () => {
    document.body.innerHTML = '<div class="comments"><p>Text</p></div>';
    const p = document.querySelector("p")!;
    expect(isVisibleElement(p)).toBe(false);
  });

  it("returns false for element inside [role=navigation]", () => {
    document.body.innerHTML = '<div role="navigation"><p>Text</p></div>';
    const p = document.querySelector("p")!;
    expect(isVisibleElement(p)).toBe(false);
  });
});

describe("hasParagraphHeuristic", () => {
  beforeEach(clearBody);

  it("returns false with fewer than 3 qualifying paragraphs", () => {
    document.body.innerHTML = `
      <p>${longText(20)}</p>
      <p>${longText(20)}</p>
    `;
    // happy-dom returns 0 for getBoundingClientRect, so paragraphs won't be "visible"
    expect(hasParagraphHeuristic()).toBe(false);
  });

  it("returns false with no paragraphs", () => {
    document.body.innerHTML = "<div>Hello</div>";
    expect(hasParagraphHeuristic()).toBe(false);
  });
});

describe("isArticleLike", () => {
  beforeEach(() => {
    clearHead();
    clearBody();
  });

  it("returns true when og:type is article", () => {
    document.head.innerHTML = '<meta property="og:type" content="article">';
    expect(isArticleLike()).toBe(true);
  });

  it("returns true when schema.org Article is present", () => {
    document.head.innerHTML = `
      <script type="application/ld+json">{"@type": "BlogPosting"}</script>
    `;
    expect(isArticleLike()).toBe(true);
  });

  it("returns false when nothing matches", () => {
    expect(isArticleLike()).toBe(false);
  });
});
