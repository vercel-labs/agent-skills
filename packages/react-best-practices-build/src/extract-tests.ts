#!/usr/bin/env node
/**
 * Extract test cases from rules for LLM evaluation
 */

import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { Rule, TestCase } from './types.js'
import { parseRuleFile, RuleFile } from './parser.js'
import { assignRuleIds } from './rule-ids.js'
import { SKILLS, DEFAULT_SKILL, TEST_CASES_FILE } from './config.js'

/**
 * Extract test cases from a rule
 */
function extractTestCases(rule: Rule): TestCase[] {
  const testCases: TestCase[] = []
  
  rule.examples.forEach((example, index) => {
    const isBad = example.label.toLowerCase().includes('incorrect') || 
                  example.label.toLowerCase().includes('wrong') ||
                  example.label.toLowerCase().includes('bad')
    const isGood = example.label.toLowerCase().includes('correct') ||
                   example.label.toLowerCase().includes('good')
    
    if (isBad || isGood) {
      testCases.push({
        ruleId: rule.id,
        ruleTitle: rule.title,
        type: isBad ? 'bad' : 'good',
        code: example.code,
        language: example.language || 'typescript',
        description: example.description || `${example.label} example for ${rule.title}`
      })
    }
  })
  
  return testCases
}

/**
 * Main extraction function
 */
async function extractTests() {
  try {
    const skillConfig = SKILLS[DEFAULT_SKILL]
    console.log('Extracting test cases from rules...')
    console.log(`Rules directory: ${skillConfig.rulesDir}`)
    console.log(`Output file: ${TEST_CASES_FILE}`)
    
    const files = await readdir(skillConfig.rulesDir)
    const ruleFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')
    
    const ruleData: RuleFile[] = []
    for (const file of ruleFiles) {
      const filePath = join(skillConfig.rulesDir, file)
      try {
        ruleData.push(await parseRuleFile(filePath, skillConfig.sectionMap))
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
      }
    }

    // Ids come from the section/title ordering build.ts uses for AGENTS.md, so a
    // test case and its rule heading always carry the same id. assignRuleIds
    // mutates the parsed rules, so file order below stays as read from disk.
    assignRuleIds(ruleData)

    const allTestCases: TestCase[] = []
    for (const { rule } of ruleData) {
      allTestCases.push(...extractTestCases(rule))
    }
    
    // Write test cases as JSON
    await writeFile(TEST_CASES_FILE, JSON.stringify(allTestCases, null, 2) + '\n', 'utf-8')
    
    console.log(`✓ Extracted ${allTestCases.length} test cases to ${TEST_CASES_FILE}`)
    console.log(`  - Bad examples: ${allTestCases.filter(tc => tc.type === 'bad').length}`)
    console.log(`  - Good examples: ${allTestCases.filter(tc => tc.type === 'good').length}`)
  } catch (error) {
    console.error('Extraction failed:', error)
    process.exit(1)
  }
}

extractTests()
