const SKIP_SEGMENTATION = ".mirlo-badge, .mirlo-marker";

export function isSegmented(paragraph: HTMLParagraphElement): boolean {
  return paragraph.querySelector(".mirlo-word") !== null;
}

export function segmentParagraph(paragraph: HTMLParagraphElement): void {
  if (!paragraph || isSegmented(paragraph)) return;

  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest(SKIP_SEGMENTATION)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let current = walker.nextNode();
  while (current) {
    textNodes.push(current as Text);
    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    segmentTextNode(textNode);
  }
}

function segmentTextNode(textNode: Text): void {
  const text = textNode.nodeValue;
  if (!text) return;

  const parent = textNode.parentNode;
  if (!parent) return;

  const fragment = document.createDocumentFragment();
  // Split on word boundaries, preserving whitespace and punctuation groups
  const tokens = text.match(/\S+|\s+/g);
  if (!tokens) return;

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      fragment.appendChild(document.createTextNode(token));
    } else {
      const span = document.createElement("span");
      span.className = "mirlo-word";
      span.dataset.mirloOriginal = token;
      span.textContent = token;
      fragment.appendChild(span);
    }
  }

  parent.replaceChild(fragment, textNode);
}
