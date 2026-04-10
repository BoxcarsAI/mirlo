import { getWordCount } from "@/utils/language";

const SKIP_CONTAINERS = [
  "nav",
  "header",
  "footer",
  "aside",
  "form",
  '[role="navigation"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  '[role="search"]',
  '[role="form"]',
  ".sidebar",
  ".menu",
  ".nav",
  ".footer",
  ".header",
  ".comment",
  ".comments",
  ".ad",
  ".advertisement",
  ".promo",
  ".related",
  ".recommended",
  "#sidebar",
  "#menu",
  "#nav",
  "#footer",
  "#header",
  "#comments",
].join(",");

export { SKIP_CONTAINERS };

export function hasOgArticleMeta(): boolean {
  const meta = document.querySelector('meta[property="og:type"]');
  if (!meta) return false;
  const content = meta.getAttribute("content") || "";
  return content.trim().toLowerCase() === "article";
}

export function hasArticleSchema(): boolean {
  const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
  for (const script of scripts) {
    const jsonText = script.textContent?.trim();
    if (!jsonText) continue;
    try {
      const parsed = JSON.parse(jsonText);
      const nodes = Array.isArray(parsed) ? parsed : [parsed];
      for (const node of nodes) {
        const typeValue = node?.["@type"];
        const types = Array.isArray(typeValue) ? typeValue : [typeValue];
        if (types.some((type: string) => ["Article", "NewsArticle", "BlogPosting"].includes(type))) {
          return true;
        }
      }
    } catch {
      continue;
    }
  }
  return false;
}

export function urlLooksLikeArticle(path?: string): boolean {
  const p = (path ?? location?.pathname ?? "").toLowerCase();
  return ["/article/", "/post/", "/blog/", "/news/", "/story/"].some((segment) =>
    p.includes(segment),
  );
}

export function isVisibleElement(element: Element): boolean {
  if (!element) return false;
  if (element.closest(SKIP_CONTAINERS)) return false;
  const rect = element.getBoundingClientRect();
  if (!rect || rect.width < 20 || rect.height < 16) return false;
  return true;
}

export function hasParagraphHeuristic(): boolean {
  const paragraphs = Array.from(document.querySelectorAll("p"));
  let qualifying = 0;
  for (const paragraph of paragraphs) {
    if (!isVisibleElement(paragraph)) continue;
    const text = paragraph.innerText?.trim();
    if (!text) continue;
    if (getWordCount(text) < 15) continue;
    qualifying += 1;
    if (qualifying >= 3) return true;
  }
  return false;
}

export function isArticleLike(): boolean {
  if (hasOgArticleMeta()) return true;
  if (hasArticleSchema()) return true;
  if (urlLooksLikeArticle()) return true;
  return hasParagraphHeuristic();
}
