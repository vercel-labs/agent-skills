/**
 * Parser for rule markdown files
 */

import { readFile } from 'fs/promises'
import { Rule, ImpactLevel } from './types.js'

export interface RuleFile {
  section: number
  subsection?: number
  rule: Rule
}

/**
 * Parse a rule markdown file into a Rule object
 */
export async function parseRuleFile(filePath: string): Promise<RuleFile> {
  const content = await readFile(filePath, 'utf-8')
  const lines = content.split('\n')

  // Extract frontmatter if present
  let frontmatter: Record<string, any> = {}
  let contentStart = 0

  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('---', 3)
    if (frontmatterEnd !== -1) {
      const frontmatterText = content.slice(3, frontmatterEnd).trim()
      frontmatterText.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim()
          frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '')
        }
      })
      contentStart = frontmatterEnd + 3
    }
  }

  // Parse the rule content
  const ruleContent = content.slice(contentStart).trim()
  const ruleLines = ruleContent.split('\n')

  // Extract title (first # or ## heading)
  let title = ''
  let titleLine = 0
  for (let i = 0; i < ruleLines.length; i++) {
    if (ruleLines[i].startsWith('##')) {
      title = ruleLines[i].replace(/^##+\s*/, '').trim()
      titleLine = i
      break
    }
  }

  // Extract impact
  let impact: Rule['impact'] = 'MEDIUM'
  let impactDescription = ''
  let explanation = ''
  let examples: Rule['examples'] = []
  let references: string[] = []

  // Parse content after title
  let currentExample: {
    label: string
    description?: string
    code: string
    language?: string
    additionalText?: string
  } | null = null
  let inCodeBlock = false
  let codeBlockLanguage = 'typescript'
  let codeBlockContent: string[] = []
  let afterCodeBlock = false
  let additionalText: string[] = []
  let hasCodeBlockForCurrentExample = false

  for (let i = titleLine + 1; i < ruleLines.length; i++) {
    const line = ruleLines[i]

    // Impact line
    if (line.includes('**Impact:')) {
      const match = line.match(
        /\*\*Impact:\s*(\w+(?:-\w+)?)\s*(?:\(([^)]+)\))?/i
      )
      if (match) {
        impact = match[1].toUpperCase().replace(/-/g, '-') as ImpactLevel
        impactDescription = match[2] || ''
      }
      continue
    }

    // Code block start
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        if (currentExample) {
          currentExample.code = codeBlockContent.join('\n')
          currentExample.language = codeBlockLanguage
        }
        codeBlockContent = []
        inCodeBlock = false
        afterCodeBlock = true
      } else {
        // Start of code block
        inCodeBlock = true
        hasCodeBlockForCurrentExample = true
        codeBlockLanguage = line.slice(3).trim() || 'typescript'
        codeBlockContent = []
        afterCodeBlock = false
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockContent.push(line)
      continue
    }

    // Example label (Incorrect, Correct, Example, Usage, Implementation, etc.)
    // Match pattern: **Label:** or **Label (description):** at end of line
    // This distinguishes example labels from inline bold text like "**Trade-off:** some text"
    const labelMatch = line.match(/^\*\*([^:]+?):\*?\*?$/)
    if (labelMatch) {
      // Save previous example if it exists
      if (currentExample) {
        if (additionalText.length > 0) {
          currentExample.additionalText = additionalText.join('\n\n')
          additionalText = []
        }
        examples.push(currentExample)
      }
      afterCodeBlock = false
      hasCodeBlockForCurrentExample = false

      const fullLabel = labelMatch[1].trim()
      // Try to extract description from parentheses if present (handles simple cases)
      // For nested parentheses like "Incorrect (O(n) per lookup)", we keep the full label
      const descMatch = fullLabel.match(
        /^([A-Za-z]+(?:\s+[A-Za-z]+)*)\s*\(([^()]+)\)$/
      )
      currentExample = {
        label: descMatch ? descMatch[1].trim() : fullLabel,
        description: descMatch ? descMatch[2].trim() : undefined,
        code: '',
        language: codeBlockLanguage,
      }
      continue
    }

    // Reference links
    if (line.startsWith('Reference:') || line.startsWith('References:')) {
      // Save current example before processing references
      if (currentExample) {
        if (additionalText.length > 0) {
          currentExample.additionalText = additionalText.join('\n\n')
          additionalText = []
        }
        examples.push(currentExample)
        currentExample = null
      }

      const refMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/g)
      if (refMatch) {
        references.push(
          ...refMatch.map((ref) => {
            const m = ref.match(/\[([^\]]+)\]\(([^)]+)\)/)
            return m ? m[2] : ref
          })
        )
      }
      continue
    }

    // Regular text (explanation or additional context after examples)
    if (line.trim() && !line.startsWith('#')) {
      if (!currentExample && !inCodeBlock) {
        // Main explanation before any examples
        explanation += (explanation ? '\n\n' : '') + line
      } else if (currentExample && (afterCodeBlock || !hasCodeBlockForCurrentExample)) {
        // Text after a code block, or text in a section without a code block
        // (e.g., "When NOT to use this pattern:" with bullet points instead of code)
        additionalText.push(line)
      }
    }
  }

  // Handle last example if still open
  if (currentExample) {
    if (additionalText.length > 0) {
      currentExample.additionalText = additionalText.join('\n\n')
    }
    examples.push(currentExample)
  }

  // Infer section from filename patterns
  // Pattern: area-description.md where area determines section
  const filename = filePath.split('/').pop() || ''
  const sectionMap: Record<string, number> = {
    async: 1,
    bundle: 2,
    server: 3,
    client: 4,
    rerender: 5,
    rendering: 6,
    js: 7,
    advanced: 8,
  }

  // Extract area from filename (first part before first dash)
  const area = filename.split('-')[0]
  const section = frontmatter.section || sectionMap[area] || 0

  const rule: Rule = {
    id: '', // Will be assigned by build script based on sorted order
    title: frontmatter.title || title,
    section: section,
    subsection: undefined,
    impact: frontmatter.impact || impact,
    impactDescription: frontmatter.impactDescription || impactDescription,
    explanation: frontmatter.explanation || explanation.trim(),
    examples,
    references: frontmatter.references
      ? frontmatter.references.split(',').map((r: string) => r.trim())
      : references,
    tags: frontmatter.tags
      ? frontmatter.tags.split(',').map((t: string) => t.trim())
      : undefined,
  }

  return {
    section,
    subsection: 0,
    rule,
  }
}
