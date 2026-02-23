/**
 * Tiptap JSON utility functions.
 * Used for migration (plain text → JSON), validation (JSON → plain text),
 * and empty-content checks.
 */

export interface JSONContent {
  type?: string;
  attrs?: Record<string, any>;
  content?: JSONContent[];
  marks?: { type: string; attrs?: Record<string, any> }[];
  text?: string;
}

/**
 * Convert plain text to Tiptap JSON document.
 * Splits on double line breaks to produce multiple paragraph nodes,
 * preserving the natural structure of existing descriptions.
 */
export function plainTextToTiptapJson(text: string): JSONContent {
  if (!text || !text.trim()) {
    return { type: 'doc', content: [{ type: 'paragraph' }] };
  }

  // Split on double newlines (or more) to create separate paragraphs
  const segments = text.split(/\n{2,}/).filter((s) => s.trim().length > 0);

  const content: JSONContent[] = segments.map((segment) => ({
    type: 'paragraph',
    content: [{ type: 'text', text: segment.trim() }],
  }));

  return { type: 'doc', content };
}

/**
 * Extract plain text from Tiptap JSON.
 * Recursively walks the content tree and concatenates all text nodes.
 * Used for Zod validation (min length) and completion score.
 */
export function tiptapJsonToPlainText(json: JSONContent | null): string {
  if (!json) return '';

  const parts: string[] = [];

  function walk(node: JSONContent) {
    if (node.text) {
      parts.push(node.text);
    }
    if (node.content) {
      node.content.forEach((child, i) => {
        walk(child);
        // Add spacing between block-level nodes
        if (
          child.type &&
          child.type !== 'text' &&
          i < (node.content?.length ?? 0) - 1
        ) {
          parts.push('\n');
        }
      });
    }
  }

  walk(json);
  return parts.join('').trim();
}

/**
 * Check if Tiptap JSON content is effectively empty.
 */
export function isTiptapContentEmpty(json: JSONContent | null): boolean {
  if (!json) return true;
  return tiptapJsonToPlainText(json).length === 0;
}

/**
 * Analyze Tiptap JSON structure for quality signals.
 * Returns counts of structural elements used in the description.
 */
export interface ContentAnalysis {
  charCount: number;
  wordCount: number;
  paragraphCount: number;
  headingCount: number;
  listCount: number;
  hasStructuredSections: boolean;
}

export function analyzeContent(json: JSONContent | null): ContentAnalysis {
  if (!json || !json.content) {
    return { charCount: 0, wordCount: 0, paragraphCount: 0, headingCount: 0, listCount: 0, hasStructuredSections: false };
  }

  let paragraphCount = 0;
  let headingCount = 0;
  let listCount = 0;

  function countNodes(node: JSONContent) {
    if (node.type === 'paragraph') paragraphCount++;
    if (node.type === 'heading') headingCount++;
    if (node.type === 'bulletList' || node.type === 'orderedList') listCount++;
    if (node.content) node.content.forEach(countNodes);
  }

  countNodes(json);

  const plainText = tiptapJsonToPlainText(json);
  const charCount = plainText.length;
  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
  const hasStructuredSections = headingCount >= 1 && paragraphCount >= 2;

  return { charCount, wordCount, paragraphCount, headingCount, listCount, hasStructuredSections };
}
