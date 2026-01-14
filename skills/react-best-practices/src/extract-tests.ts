#!/usr/bin/env node
/**
 * Extract test cases from rules for LLM evaluation
 */

import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { Rule, TestCase } from './types.js'
import { parseRuleFile } from './parser.js'

const RULES_DIR = join(process.cwd(), 'rules')
const OUTPUT_FILE = join(process.cwd(), 'test-cases.json')

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
    console.log('Extracting test cases from rules...')
    
    const files = await readdir(RULES_DIR)
    const ruleFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'README.md')
    
    const allTestCases: TestCase[] = []
    
    for (const file of ruleFiles) {
      const filePath = join(RULES_DIR, file)
      try {
        const { rule } = await parseRuleFile(filePath)
        const testCases = extractTestCases(rule)
        allTestCases.push(...testCases)
      } catch (error) {
        console.error(`Error processing ${file}:`, error)
      }
    }
    
    // Write test cases as JSON
    await writeFile(OUTPUT_FILE, JSON.stringify(allTestCases, null, 2), 'utf-8')
    
    console.log(`✓ Extracted ${allTestCases.length} test cases to ${OUTPUT_FILE}`)
    console.log(`  - Bad examples: ${allTestCases.filter(tc => tc.type === 'bad').length}`)
    console.log(`  - Good examples: ${allTestCases.filter(tc => tc.type === 'good').length}`)
  } catch (error) {
    console.error('Extraction failed:', error)
    process.exit(1)
  }
}

extractTests()
