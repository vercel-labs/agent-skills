# paper-to-code Quick Start Guide

## ✅ Skill Installed

Location: `~/.claude/skills/paper-to-code/`

---

## Basic Usage

### From Any Project Directory:

```bash
cd ~/your-project
```

**Then in Claude Code, say:**

```
"Use paper-to-code to implement [PAPER_URL_OR_PATH]"
```

---

## Examples

### 1. arXiv Paper
```
"Use paper-to-code for https://arxiv.org/pdf/1706.03762.pdf"
```

### 2. Local PDF
```
"Use paper-to-code to implement ./research/paper.pdf"
```

### 3. With Output Directory
```
"Use paper-to-code for arXiv:2103.00020, save in ./clip-impl/"
```

### 4. Just arXiv ID
```
"Use paper-to-code for arXiv paper 2106.09685"
```

---

## What It Does

1. ✅ Asks where to save implementation
2. ✅ Downloads/extracts paper
3. ✅ Analyzes algorithms and formulas
4. ✅ Creates implementation plan
5. ✅ Generates complete Python codebase:
   - Core algorithms
   - Tests (comprehensive)
   - Documentation
   - Examples
   - Configuration
6. ✅ Validates implementation

---

## Output Structure

```
your-project/
├── src/
│   ├── core/           # Main algorithms
│   ├── utils/          # Helpers
│   └── config/         # Settings
├── tests/              # Comprehensive tests
├── examples/           # Usage examples
├── requirements.txt    # Dependencies
├── setup.py            # Package setup
└── README.md           # Full docs
```

---

## Features

- ✅ **Proper Python patterns** (dataclasses with field(default_factory=...))
- ✅ **Edge case handling** (division by zero, NaN/Inf prevention)
- ✅ **Comprehensive tests** (29+ tests including edge cases)
- ✅ **Full documentation** with paper references
- ✅ **Type hints** throughout
- ✅ **Formula preservation** in comments

---

## Supported Input Formats

- arXiv URLs: `https://arxiv.org/pdf/2509.09995.pdf`
- arXiv IDs: `2509.09995`
- PDF URLs: Any direct PDF link
- Local PDFs: `/path/to/paper.pdf` or `./relative/path.pdf`

---

## Requirements

The skill uses `uv` for package management. Virtual environment is at:
```
/Users/joannastew/projects/DeepCode/paper-to-code/.venv/
```

Activate if needed:
```bash
source /Users/joannastew/projects/DeepCode/paper-to-code/.venv/bin/activate
```

---

## Tips

1. **Let it ask for directory**: Don't specify output dir unless you want a specific location
2. **Review generated code**: Always review before using in production
3. **Run tests**: `cd output-dir && pytest tests/ -v`
4. **Customize**: Generated code is a starting point - modify as needed
5. **Check README**: Generated README has complete usage instructions

---

## Example Session

```
User: cd ~/projects/new-ml-project

User (to Claude Code):
"Use paper-to-code to implement the Vision Transformer paper
https://arxiv.org/pdf/2010.11929.pdf"

Claude: Where would you like me to save the implementation?

User: ./vit-implementation

Claude:
[Downloads PDF...]
[Analyzes paper...]
[Generates code...]

✅ Implementation Complete!

📁 Location: ./vit-implementation/
📊 Generated: 6 modules, 15 tests, full documentation
🧪 Tests: 15/15 passing

Next Steps:
1. cd vit-implementation
2. pytest tests/
3. python examples/basic_usage.py
```

---

## Troubleshooting

### Skill not found?
Check symlink: `ls -la ~/.claude/skills/paper-to-code`

### PDF extraction fails?
Activate venv: `source /Users/joannastew/projects/DeepCode/paper-to-code/.venv/bin/activate`

### Want to see what it generates?
Check the QuantAgent example: `~/projects/QuantTrader/`

---

## Version

**v1.1.0** - Updated with real-world testing learnings

- Proper dataclass patterns
- Comprehensive edge case handling
- Enhanced testing templates
- Validated with QuantAgent paper (29/29 tests passing)

---

## More Info

- Full documentation: `~/.claude/skills/paper-to-code/README.md`
- Changelog: `~/.claude/skills/paper-to-code/CHANGELOG.md`
- Updates summary: `~/.claude/skills/paper-to-code/UPDATES_SUMMARY.md`

---

**Ready to implement research papers? Just say "use paper-to-code"!**
