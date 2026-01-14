#!/usr/bin/env node
/**
 * Migration script to split RPG.md into individual rule files
 * This is a one-time script to help migrate existing content
 */

import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const RPG_FILE = join(process.cwd(), 'RPG.md')
const RULES_DIR = join(process.cwd(), 'rules')

/**
 * Extract section number and title from heading
 */
function parseSectionHeading(line: string): { number: number; title: string } | null {
  const match = line.match(/^##\s+(\d+)\.\s+(.+)$/)
  if (match) {
    return {
      number: parseInt(match[1]),
      title: match[2].trim()
    }
  }
  return null
}

/**
 * Extract rule number and title from heading
 */
function parseRuleHeading(line: string): { section: number; subsection: number; title: string } | null {
  const match = line.match(/^###\s+(\d+)\.(\d+)\s+(.+)$/)
  if (match) {
    return {
      section: parseInt(match[1]),
      subsection: parseInt(match[2]),
      title: match[3].trim()
    }
  }
  return null
}

/**
 * Extract impact from line
 */
function extractImpact(line: string): { impact: string; description?: string } | null {
  const match = line.match(/\*\*Impact:\s*(\w+(?:-\w+)?)\s*(?:\(([^)]+)\))?/i)
  if (match) {
    return {
      impact: match[1].toUpperCase().replace(/-/g, '-'),
      description: match[2]
    }
  }
  return null
}

async function migrate() {
  try {
    console.log('Migrating RPG.md to individual rule files...')
    
    if (!existsSync(RPG_FILE)) {
      console.error(`RPG.md not found at ${RPG_FILE}`)
      process.exit(1)
    }
    
    // Ensure rules directory exists
    if (!existsSync(RULES_DIR)) {
      await mkdir(RULES_DIR, { recursive: true })
    }
    
    const content = await readFile(RPG_FILE, 'utf-8')
    const lines = content.split('\n')
    
    let currentSection: { number: number; title: string; impact?: string; introduction?: string } | null = null
    let currentRule: { section: number; subsection: number; title: string; content: string[] } | null = null
    let inCodeBlock = false
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check for section heading
      const sectionInfo = parseSectionHeading(line)
      if (sectionInfo) {
        // Save previous section if exists
        if (currentSection) {
          const sectionFile = join(RULES_DIR, `section-${currentSection.number}.md`)
          let sectionContent = `# ${currentSection.number}. ${currentSection.title}\n\n`
          if (currentSection.impact) {
            sectionContent += `**Impact: ${currentSection.impact}**\n\n`
          }
          if (currentSection.introduction) {
            sectionContent += `## Introduction\n\n${currentSection.introduction}\n`
          }
          await writeFile(sectionFile, sectionContent, 'utf-8')
        }
        
        currentSection = sectionInfo
        currentRule = null
        
        // Look for impact on next few lines
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const impactInfo = extractImpact(lines[j])
          if (impactInfo) {
            currentSection.impact = impactInfo.impact
            break
          }
        }
        
        // Collect introduction text until first rule
        let introduction: string[] = []
        for (let j = i + 1; j < lines.length; j++) {
          if (parseRuleHeading(lines[j])) {
            break
          }
          if (!lines[j].match(/^###/)) {
            introduction.push(lines[j])
          }
        }
        currentSection.introduction = introduction.join('\n').trim()
        continue
      }
      
      // Check for rule heading
      const ruleInfo = parseRuleHeading(line)
      if (ruleInfo) {
        // Save previous rule if exists
        if (currentRule && currentSection) {
          const ruleFile = join(RULES_DIR, `section-${currentRule.section}-rule-${currentRule.subsection}.md`)
          const ruleContent = currentRule.content.join('\n')
          await writeFile(ruleFile, ruleContent, 'utf-8')
          console.log(`Created ${ruleFile}`)
        }
        
        currentRule = {
          ...ruleInfo,
          content: [line]
        }
        continue
      }
      
      // Accumulate content for current rule
      if (currentRule) {
        currentRule.content.push(line)
      }
    }
    
    // Save last rule
    if (currentRule && currentSection) {
      const ruleFile = join(RULES_DIR, `section-${currentRule.section}-rule-${currentRule.subsection}.md`)
      const ruleContent = currentRule.content.join('\n')
      await writeFile(ruleFile, ruleContent, 'utf-8')
      console.log(`Created ${ruleFile}`)
    }
    
    // Save last section
    if (currentSection) {
      const sectionFile = join(RULES_DIR, `section-${currentSection.number}.md`)
      let sectionContent = `# ${currentSection.number}. ${currentSection.title}\n\n`
      if (currentSection.impact) {
        sectionContent += `**Impact: ${currentSection.impact}**\n\n`
      }
      if (currentSection.introduction) {
        sectionContent += `## Introduction\n\n${currentSection.introduction}\n`
      }
      await writeFile(sectionFile, sectionContent, 'utf-8')
      console.log(`Created ${sectionFile}`)
    }
    
    console.log('\n✓ Migration complete!')
    console.log('Note: You may need to manually add frontmatter to rule files.')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
