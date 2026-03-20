import { getWordCount } from "@/utils/language";
import { isVisibleElement } from "@/utils/article-detection";

const SKIP_SELECTORS =
  "script,style,textarea,code,pre,svg,math,head,title,input,option,select,button";

export { SKIP_SELECTORS };

export function getParagraphText(paragraph: Element): string {
  if (!paragraph) return "";
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest(".mirlo-badge")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let text = "";
  let current = walker.nextNode();
  while (current) {
    const value = current.nodeValue?.trim();
    if (value) {
      text = `${text} ${value}`.trim();
    }
    current = walker.nextNode();
  }

  return text;
}

export function isEligibleParagraph(paragraph: HTMLParagraphElement): boolean {
  if (!paragraph) return false;
  if (!isVisibleElement(paragraph)) return false;
  const text = paragraph.innerText?.trim();
  if (!text) return false;
  if (getWordCount(text) <= 15) return false;
  if (paragraph.classList.contains("mirlo-translated")) return false;
  return true;
}
