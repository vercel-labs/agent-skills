#!/usr/bin/env node
/**
 * Validate rule files follow the correct structure
 */

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { Rule } from './types.js'
import { parseRuleFile } from './parser.js'
import { RULES_DIR, OUTPUT_FILE, TEST_CASES_FILE } from './config.js'

interface ValidationError {
  file: string
  ruleId?: string
  message: string
}

/**
 * Validate a rule
 */
function validateRule(rule: Rule, file: string): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Note: rule.id is auto-generated during build, not required in source files
  
  if (!rule.title || rule.title.trim().length === 0) {
    errors.push({ file, ruleId: rule.id, message: 'Missing or empty title' })
  }
  
  if (!rule.explanation || rule.explanation.trim().length === 0) {
    errors.push({ file, ruleId: rule.id, message: 'Missing or empty explanation' })
  }
  
  if (!rule.examples || rule.examples.length === 0) {
    errors.push({ file, ruleId: rule.id, message: 'Missing examples (need at least one bad and one good example)' })
  } else {
    // Filter out informational examples (notes, trade-offs, etc.) that don't have code
    const codeExamples = rule.examples.filter(e => e.code && e.code.trim().length > 0)
    
    const hasBad = codeExamples.some(e => 
      e.label.toLowerCase().includes('incorrect') || 
      e.label.toLowerCase().includes('wrong') ||
      e.label.toLowerCase().includes('bad')
    )
    const hasGood = codeExamples.some(e => 
      e.label.toLowerCase().includes('correct') || 
      e.label.toLowerCase().includes('good') ||
      e.label.toLowerCase().includes('usage') ||
      e.label.toLowerCase().includes('implementation') ||
      e.label.toLowerCase().includes('example')
    )
    
    if (codeExamples.length === 0) {
      errors.push({ file, ruleId: rule.id, message: 'Missing code examples' })
    } else if (!hasBad && !hasGood) {
      errors.push({ file, ruleId: rule.id, message: 'Missing bad/incorrect or good/correct examples' })
    }
  }
  
  const validImpacts: Rule['impact'][] = ['CRITICAL', 'HIGH', 'MEDIUM-HIGH', 'MEDIUM', 'LOW-MEDIUM', 'LOW']
  if (!validImpacts.includes(rule.impact)) {
    errors.push({ file, ruleId: rule.id, message: `Invalid impact level: ${rule.impact}. Must be one of: ${validImpacts.join(', ')}` })
  }
  
  return errors
}

/**
 * Test cases are keyed by rule id, and that id must be the same one AGENTS.md
 * uses for the rule heading — otherwise a consumer can't join a case to its rule.
 */
async function validateTestCases(): Promise<ValidationError[]> {
  const errors: ValidationError[] = []
  const file = 'test-cases.json'

  const agents = await readFile(OUTPUT_FILE, 'utf-8')
  const titlesById = new Map<string, string>()
  for (const line of agents.split('\n')) {
    const m = line.match(/^### (\d+\.\d+) (.+)$/)
    if (m) titlesById.set(m[1], m[2].trim())
  }

  const testCases = JSON.parse(await readFile(TEST_CASES_FILE, 'utf-8'))
  for (const testCase of testCases) {
    if (!testCase.ruleId) {
      errors.push({ file, message: `Test case for "${testCase.ruleTitle}" has no ruleId` })
      continue
    }
    const title = titlesById.get(testCase.ruleId)
    if (title === undefined) {
      errors.push({ file, ruleId: testCase.ruleId, message: `ruleId is not a heading in AGENTS.md (case: "${testCase.ruleTitle}")` })
    } else if (title !== testCase.ruleTitle) {
      errors.push({ file, ruleId: testCase.ruleId, message: `ruleTitle "${testCase.ruleTitle}" does not match AGENTS.md heading "${title}"` })
    }
  }

  return errors
}

/**
 * Main validation function
 */
async function validate() {
  try {
    console.log('Validating rule files...')
    console.log(`Rules directory: ${RULES_DIR}`)
    
    const files = await readdir(RULES_DIR)
    const ruleFiles = files.filter(f => f.endsWith('.md') && !f.startsWith('_'))
    
    const allErrors: ValidationError[] = []
    
    for (const file of ruleFiles) {
      const filePath = join(RULES_DIR, file)
      try {
        const { rule } = await parseRuleFile(filePath)
        const errors = validateRule(rule, file)
        allErrors.push(...errors)
      } catch (error) {
        allErrors.push({ 
          file, 
          message: `Failed to parse: ${error instanceof Error ? error.message : String(error)}` 
        })
      }
    }
    
    if (allErrors.length > 0) {
      console.error('\n✗ Validation failed:\n')
      allErrors.forEach(error => {
        console.error(`  ${error.file}${error.ruleId ? ` (${error.ruleId})` : ''}: ${error.message}`)
      })
      process.exit(1)
    } else {
      console.log(`✓ All ${ruleFiles.length} rule files are valid`)
    }

    const testCaseErrors = await validateTestCases()
    if (testCaseErrors.length > 0) {
      console.error('\n✗ Test case validation failed:\n')
      testCaseErrors.forEach(error => {
        console.error(`  ${error.file}${error.ruleId ? ` (${error.ruleId})` : ''}: ${error.message}`)
      })
      process.exit(1)
    }
    console.log('✓ test-cases.json rule ids match AGENTS.md headings')
  } catch (error) {
    console.error('Validation failed:', error)
    process.exit(1)
  }
}

validate()
