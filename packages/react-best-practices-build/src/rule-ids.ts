/**
 * Rule id assignment shared by every build artifact.
 *
 * Ids are build-time output, not source data: `<section>.<position>` where
 * position follows the title sort. AGENTS.md and test-cases.json must agree
 * on a rule's id, so both derive it here instead of each doing its own pass.
 */

import { RuleFile } from './parser.js'
import { Section } from './types.js'

export function assignRuleIds(ruleData: RuleFile[]): Section[] {
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
  return Array.from(sectionsMap.values()).sort(
    (a, b) => a.number - b.number
  )
}
