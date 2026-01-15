/**
 * Configuration for the build tooling
 */

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Path to the skill directory (relative to this package)
export const SKILL_DIR = join(__dirname, '../../..', 'skills/react-best-practices')
export const BUILD_DIR = join(__dirname, '..')
export const RULES_DIR = join(SKILL_DIR, 'rules')
export const METADATA_FILE = join(SKILL_DIR, 'metadata.json')
export const OUTPUT_FILE = join(SKILL_DIR, 'AGENTS.md')
// Test cases are build artifacts, not part of the skill
export const TEST_CASES_FILE = join(BUILD_DIR, 'test-cases.json')
