# Accessibility Best Practices

A structured repository for creating and maintaining accessibility (a11y) best practices for React and Next.js, optimized for agents and LLMs.

## Structure

- `rules/` - Individual rule files (one per rule)
  - `_sections.md` - Section metadata (titles, impacts, descriptions)
  - `_template.md` - Template for creating new rules
  - `area-description.md` - Individual rule files
- `metadata.json` - Document metadata (version, organization, abstract)
- __`AGENTS.md`__ - Compiled output (generated)

## Creating a New Rule

1. Copy `rules/_template.md` to `rules/area-description.md`
2. Choose the appropriate area prefix:
   - `semantic-` for Semantic HTML (Section 1)
   - `keyboard-` for Keyboard Navigation (Section 2)
   - `aria-` for ARIA Attributes (Section 3)
   - `form-` for Forms & Inputs (Section 4)
   - `media-` for Images & Media (Section 5)
   - `color-` for Color & Contrast (Section 6)
   - `focus-` for Focus Management (Section 7)
   - `dynamic-` for Dynamic Content & Live Regions (Section 8)
   - `nextjs-` for Next.js Specific Patterns (Section 9)
   - `testing-` for Testing & Validation (Section 10)
3. Fill in the frontmatter and content
4. Ensure you have clear examples with explanations
5. Include WCAG success criteria references where applicable

## Impact Levels

- `CRITICAL` - Foundational accessibility, blocks users entirely if missing
- `HIGH` - Significant barriers to access
- `MEDIUM-HIGH` - Notable accessibility gaps
- `MEDIUM` - Moderate usability improvements
- `LOW-MEDIUM` - Incremental improvements

## Contributing

When adding or modifying rules:

1. Use the correct filename prefix for your section
2. Follow the `_template.md` structure
3. Include clear bad/good examples with explanations
4. Add appropriate tags
5. Reference WCAG 2.2 success criteria when applicable
6. Rules are automatically sorted by title
