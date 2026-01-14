#!/usr/bin/env node
/**
 * Build script to compile individual rule files into AGENTS.md
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { Rule, Section, GuidelinesDocument, ImpactLevel } from './types.js'
import { parseRuleFile, RuleFile } from './parser.js'

const RULES_DIR = join(process.cwd(), 'rules')
const OUTPUT_FILE = join(process.cwd(), 'AGENTS.md')

/**
 * Generate markdown from rules
 */
function generateMarkdown(
  sections: Section[],
  metadata: {
    version: string
    organization: string
    date: string
    abstract: string
    references?: string[]
  }
): string {
  let md = `# React Best Practices\n\n`
  md += `**Version ${metadata.version}**  \n`
  md += `${metadata.organization}  \n`
  md += `${metadata.date}\n\n`
  md += `> **Note:**  \n`
  md += `> This document is mainly for agents and LLMs to follow when maintaining,  \n`
  md += `> generating, or refactoring React and Next.js codebases at Vercel. Humans  \n`
  md += `> may also find it useful, but guidance here is optimized for automation  \n`
  md += `> and consistency by AI-assisted workflows.\n\n`
  md += `---\n\n`
  md += `## Abstract\n\n`
  md += `${metadata.abstract}\n\n`
  md += `---\n\n`
  md += `## Table of Contents\n\n`

  // Generate TOC
  sections.forEach((section) => {
    md += `${section.number}. [${section.title}](#${
      section.number
    }-${section.title.toLowerCase().replace(/\s+/g, '-')}) — **${
      section.impact
    }**\n`
    section.rules.forEach((rule) => {
      // GitHub generates anchors from the full heading text: "1.1 Title" -> "#11-title"
      const anchor = `${rule.id} ${rule.title}`
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '') // Remove special characters except hyphens
      md += `   - ${rule.id} [${rule.title}](#${anchor})\n`
    })
  })

  md += `\n---\n\n`

  // Generate sections
  sections.forEach((section) => {
    md += `## ${section.number}. ${section.title}\n\n`
    md += `**Impact: ${section.impact}${
      section.impactDescription ? ` (${section.impactDescription})` : ''
    }**\n\n`
    if (section.introduction) {
      md += `${section.introduction}\n\n`
    }

    section.rules.forEach((rule) => {
      md += `### ${rule.id} ${rule.title}\n\n`
      md += `**Impact: ${rule.impact}${
        rule.impactDescription ? ` (${rule.impactDescription})` : ''
      }**\n\n`
      md += `${rule.explanation}\n\n`

      rule.examples.forEach((example) => {
        if (example.description) {
          md += `**${example.label}: ${example.description}**\n\n`
        } else {
          md += `**${example.label}:**\n\n`
        }
        // Only generate code block if there's actual code
        if (example.code && example.code.trim()) {
          md += `\`\`\`${example.language || 'typescript'}\n`
          md += `${example.code}\n`
          md += `\`\`\`\n\n`
        }
        if (example.additionalText) {
          md += `${example.additionalText}\n\n`
        }
      })

      if (rule.references && rule.references.length > 0) {
        md += `Reference: ${rule.references
          .map((ref) => `[${ref}](${ref})`)
          .join(', ')}\n\n`
      }
    })

    md += `---\n\n`
  })

  // Add references section
  if (metadata.references && metadata.references.length > 0) {
    md += `## References\n\n`
    metadata.references.forEach((ref, i) => {
      md += `${i + 1}. [${ref}](${ref})\n`
    })
  }

  return md
}

/**
 * Main build function
 */
async function build() {
  try {
    console.log('Building AGENTS.md from rules...')

    // Read all rule files (exclude files starting with _ and README.md)
    const files = await readdir(RULES_DIR)
    const ruleFiles = files
      .filter(
        (f) => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md'
      )
      .sort() // Sort filenames for consistent ordering across systems

    const ruleData: RuleFile[] = []
    for (const file of ruleFiles) {
      const filePath = join(RULES_DIR, file)
      try {
        const parsed = await parseRuleFile(filePath)
        ruleData.push(parsed)
      } catch (error) {
        console.error(`Error parsing ${file}:`, error)
      }
    }

    // Group rules by section
    const sectionsMap = new Map<number, Section>()

    ruleData.forEach(({ section, rule }) => {
      if (!sectionsMap.has(section)) {
        sectionsMap.set(section, {
          number: section,
          title: `Section ${section}`, // Will be overridden by section metadata
          impact: rule.impact,
          rules: [],
        })
      }
      sectionsMap.get(section)!.rules.push(rule)
    })

    // Sort rules within each section by title (using en-US locale for consistency across environments)
    sectionsMap.forEach((section) => {
      section.rules.sort((a, b) =>
        a.title.localeCompare(b.title, 'en-US', { sensitivity: 'base' })
      )

      // Assign IDs based on sorted order
      section.rules.forEach((rule, index) => {
        rule.id = `${section.number}.${index + 1}`
        rule.subsection = index + 1
      })
    })

    // Convert to array and sort
    const sections = Array.from(sectionsMap.values()).sort(
      (a, b) => a.number - b.number
    )

    // Read section metadata from consolidated _sections.md file
    const sectionsFile = join(RULES_DIR, '_sections.md')
    try {
      const sectionsContent = await readFile(sectionsFile, 'utf-8')

      // Parse sections using regex to match each section block
      const sectionBlocks = sectionsContent
        .split(/(?=^## \d+\. )/m)
        .filter(Boolean)

      for (const block of sectionBlocks) {
        // Extract section number and title, removing section ID in parentheses
        const headerMatch = block.match(
          /^## (\d+)\.\s+(.+?)(?:\s+\([^)]+\))?$/m
        )
        if (!headerMatch) continue

        const sectionNumber = parseInt(headerMatch[1])
        const sectionTitle = headerMatch[2].trim() // Strip (id) for output

        // Extract impact (format: **Impact:** CRITICAL)
        const impactMatch = block.match(/\*\*Impact:\*\*\s+(\w+(?:-\w+)?)/i)
        const impactLevel = impactMatch
          ? (impactMatch[1].toUpperCase().replace(/-/g, '-') as ImpactLevel)
          : 'MEDIUM'

        // Extract description (format: **Description:** text)
        const descMatch = block.match(
          /\*\*Description:\*\*\s+(.+?)(?=\n\n##|$)/s
        )
        const description = descMatch ? descMatch[1].trim() : ''

        // Update section if it exists
        const section = sections.find((s) => s.number === sectionNumber)
        if (section) {
          section.title = sectionTitle
          section.impact = impactLevel
          section.introduction = description
        }
      }
    } catch (error) {
      console.warn(
        'Warning: Could not read _sections.md, using defaults',
        error
      )
    }

    // Read metadata
    const metadataFile = join(process.cwd(), 'metadata.json')
    let metadata
    try {
      const metadataContent = await readFile(metadataFile, 'utf-8')
      metadata = JSON.parse(metadataContent)
    } catch {
      metadata = {
        version: '1.0',
        organization: 'Vercel Engineering',
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        }),
        abstract:
          'Performance optimization guide for React and Next.js applications, ordered by impact.',
      }
    }

    // Generate markdown
    const markdown = generateMarkdown(sections, metadata)

    // Write output
    await writeFile(OUTPUT_FILE, markdown, 'utf-8')

    console.log(
      `✓ Built AGENTS.md with ${sections.length} sections and ${ruleData.length} rules`
    )
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()
