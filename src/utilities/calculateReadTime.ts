import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'
import type { SerializedTextNode } from '@payloadcms/richtext-lexical'

/**
 * Calculate reading time from Lexical editor content
 * @param content - Serialized Lexical editor state
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time string (e.g., "5 min read")
 */
export function calculateReadTime(
  content: SerializedEditorState | null | undefined,
  wordsPerMinute: number = 200,
): string {
  if (!content?.root?.children) {
    return '1 min read'
  }

  const wordCount = countWords(content.root.children)

  if (wordCount === 0) {
    return '1 min read'
  }

  const minutes = Math.ceil(wordCount / wordsPerMinute)

  return `${minutes} min read`
}

/**
 * Recursively count words in Lexical nodes
 */
function countWords(nodes: SerializedLexicalNode[]): number {
  let count = 0

  for (const node of nodes) {
    // Text nodes contain the actual content
    if (node.type === 'text') {
      const textNode = node as SerializedTextNode
      if (textNode.text) {
        // Split by whitespace and filter empty strings
        const words = textNode.text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0)
        count += words.length
      }
    }

    // Recursively process child nodes
    if ('children' in node && Array.isArray(node.children)) {
      count += countWords(node.children)
    }

    // Process block nodes that might have fields with rich text
    if (node.type === 'block' && 'fields' in node && node.fields) {
      const fields = node.fields as Record<string, any>
      // Some blocks might have nested rich text content
      if (fields.content?.root?.children) {
        count += countWords(fields.content.root.children)
      }
    }
  }

  return count
}
