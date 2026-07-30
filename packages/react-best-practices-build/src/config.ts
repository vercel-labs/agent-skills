/**
 * Configuration for the build tooling
 */

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Base paths
export const SKILLS_DIR = join(__dirname, '../../..', 'skills')
export const BUILD_DIR = join(__dirname, '..')

// Skill configurations
export interface SkillConfig {
  name: string
  title: string
  description: string
  skillDir: string
  rulesDir: string
  metadataFile: string
  outputFile: string
  sectionMap: Record<string, number>
}

export const SKILLS: Record<string, SkillConfig> = {
  'vercel-react-best-practices': {
    name: 'vercel-react-best-practices',
    title: 'React Best Practices',
    description: 'React and Next.js codebases',
    skillDir: join(SKILLS_DIR, 'vercel-react-best-practices'),
    rulesDir: join(SKILLS_DIR, 'vercel-react-best-practices/rules'),
    metadataFile: join(SKILLS_DIR, 'vercel-react-best-practices/metadata.json'),
    outputFile: join(SKILLS_DIR, 'vercel-react-best-practices/AGENTS.md'),
    sectionMap: {
      async: 1,
      bundle: 2,
      server: 3,
      client: 4,
      rerender: 5,
      rendering: 6,
      js: 7,
      advanced: 8,
    },
  },
  'vercel-react-native-skills': {
    name: 'vercel-react-native-skills',
    title: 'React Native Skills',
    description: 'React Native codebases',
    skillDir: join(SKILLS_DIR, 'vercel-react-native-skills'),
    rulesDir: join(SKILLS_DIR, 'vercel-react-native-skills/rules'),
    metadataFile: join(SKILLS_DIR, 'vercel-react-native-skills/metadata.json'),
    outputFile: join(SKILLS_DIR, 'vercel-react-native-skills/AGENTS.md'),
    sectionMap: {
      rendering: 1,
      'list-performance': 2,
      animation: 3,
      scroll: 4,
      navigation: 5,
      'react-state': 6,
      state: 7,
      'react-compiler': 8,
      ui: 9,
      'design-system': 10,
      monorepo: 11,
      imports: 12,
      js: 13,
      fonts: 14,
    },
  },
  'vercel-composition-patterns': {
    name: 'vercel-composition-patterns',
    title: 'React Composition Patterns',
    description: 'React codebases using composition',
    skillDir: join(SKILLS_DIR, 'vercel-composition-patterns'),
    rulesDir: join(SKILLS_DIR, 'vercel-composition-patterns/rules'),
    metadataFile: join(SKILLS_DIR, 'vercel-composition-patterns/metadata.json'),
    outputFile: join(SKILLS_DIR, 'vercel-composition-patterns/AGENTS.md'),
    sectionMap: {
      architecture: 1,
      state: 2,
      patterns: 3,
      react19: 4,
    },
  },
}

// Default skill (for backwards compatibility)
export const DEFAULT_SKILL = 'vercel-react-best-practices'

// Legacy exports for backwards compatibility
export const SKILL_DIR = SKILLS[DEFAULT_SKILL].skillDir
export const RULES_DIR = SKILLS[DEFAULT_SKILL].rulesDir
export const METADATA_FILE = SKILLS[DEFAULT_SKILL].metadataFile
export const OUTPUT_FILE = SKILLS[DEFAULT_SKILL].outputFile

// Test cases are build artifacts, not part of the skill
export const TEST_CASES_FILE = join(BUILD_DIR, 'test-cases.json')
