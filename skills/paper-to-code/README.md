# Paper-to-Code Skill for Claude Code

A comprehensive Claude Code skill that transforms research papers into production-ready Python code implementations.

## What This Skill Does

Takes a research paper (PDF, URL, or arXiv link) and automatically:

1. ✅ Downloads and extracts paper content
2. ✅ Analyzes algorithms, formulas, and methodologies
3. ✅ Creates detailed implementation plans
4. ✅ Generates complete Python codebase with:
   - Core algorithm implementations
   - Comprehensive test suites (pytest)
   - Full documentation (README, docstrings)
   - Example usage scripts
   - Configuration files
5. ✅ Validates the implementation

## Installation for Claude Code

### Option 1: Direct Usage (Recommended)

Copy the `paper-to-code` folder to your Claude Code skills directory or reference it directly:

```
"Use the paper-to-code skill to implement the QuantAgent paper from https://arxiv.org/pdf/2509.09995.pdf"
```

### Option 2: Helper Scripts Only

If you just want the PDF extraction helper:

```bash
python paper-to-code/helpers/document_processor.py paper.pdf paper.txt
```

## Usage

### Basic Example

```
User: "Implement this paper: https://arxiv.org/pdf/2509.09995.pdf"

Claude Code: [Activates paper-to-code skill]
1. Asks: "Where would you like me to save the implementation?"
2. Downloads and extracts PDF
3. Analyzes paper (algorithms, formulas, methodology)
4. Creates implementation plan
5. Generates complete codebase
6. Runs validation tests
7. Returns: "✅ Implementation complete in ./quantagent/"
```

### What Gets Generated

```
your-project/
├── src/
│   ├── core/
│   │   ├── algorithm.py          # Main algorithm implementation
│   │   └── data_structures.py    # Supporting data structures
│   ├── utils/
│   │   └── helpers.py             # Utility functions
│   └── config/
│       └── settings.py            # Configuration
├── tests/
│   ├── test_algorithm.py          # Comprehensive tests
│   ├── test_edge_cases.py         # Edge case tests
│   └── test_paper_claims.py       # Verification tests
├── examples/
│   └── basic_usage.py             # Usage examples
├── docs/
│   └── algorithm_details.md       # Detailed documentation
├── requirements.txt               # Dependencies
├── setup.py                       # Package setup
├── .gitignore                     # Git ignore file
└── README.md                      # Complete documentation
```

## Features

### Paper Analysis
- Extracts algorithms with pseudocode
- Identifies mathematical formulas with equation numbers
- Determines dependencies and data structures
- Suggests optimal project structure

### Code Generation
- **Type-hinted Python code** (PEP 484 compliant)
- **Comprehensive docstrings** with algorithm steps from paper
- **Formula comments** above implementations
- **Clean, modular architecture**
- **Proper dataclass patterns** with `field(default_factory=...)` for mutable defaults
- **Edge case handling** built-in (division by zero, empty data, NaN/Inf prevention)

### Testing
- **Unit tests** for all main functions
- **Integration tests** for complete workflows
- **Edge case tests** for robustness (empty/insufficient data, constant values, division by zero)
- **NaN/Inf prevention tests**
- **Paper claim verification** tests

### Documentation
- **Complete README** with installation, usage, and examples
- **Inline documentation** with paper references
- **Algorithm explanations** from paper
- **Citation information**

## Supported Input Formats

- **arXiv papers**: `https://arxiv.org/pdf/2509.09995.pdf` or just `2509.09995`
- **Direct PDF URLs**: Any direct link to a PDF file
- **Local PDF files**: `/path/to/paper.pdf`
- **Paper text**: Already extracted text

## Dependencies

### Core (bundled with skill):
- Python 3.8+
- Claude Code

### Optional (for PDF extraction):
- `pdftotext` (command-line tool) - Recommended
- OR `PyPDF2` (Python package)
- OR `pdfminer.six` (Python package)
- OR `pdfplumber` (Python package)

### Generated Code Dependencies:
- Automatically detected from paper
- Listed in generated `requirements.txt`
- Common: `numpy`, `pandas`, `torch`, `scikit-learn`, `pytest`

## Workflow

1. **Input Processing**: Downloads/extracts paper
2. **Analysis**: LLM-powered extraction of algorithms and formulas
3. **Planning**: Creates detailed implementation strategy
4. **Generation**: Produces complete codebase iteratively
5. **Validation**: Syntax checks and test execution
6. **Documentation**: Comprehensive README and examples

## Examples

### Example 1: QuantAgent Paper

```
"Implement the QuantAgent paper: https://arxiv.org/pdf/2509.09995.pdf
Save it in ~/quantagent-implementation/"
```

Result: Complete QuantAgent implementation with:
- Financial modeling agents
- Multi-agent coordination
- Data processing pipeline
- Backtesting framework
- 50+ tests

### Example 2: Local PDF

```
"Implement the algorithm from ./research/transformer_paper.pdf"
```

### Example 3: With Customization

```
"Implement this paper but focus only on the core Transformer architecture,
skip the training code: https://arxiv.org/pdf/1706.03762.pdf"
```

## Advanced Features

### Formula Preservation
Formulas are preserved as comments above implementations:

```python
# Formula from paper (Eq. 3):
# Attention(Q, K, V) = softmax(QK^T / √d_k)V
# Where:
#   Q: Query matrix
#   K: Key matrix
#   V: Value matrix
#   d_k: Dimension of keys
attention = torch.softmax(Q @ K.T / math.sqrt(d_k), dim=-1) @ V
```

### Paper Claim Verification
Generated tests verify paper claims:

```python
def test_complexity_matches_paper():
    """Verify O(n log n) complexity claim from paper."""
    # Implementation that measures and validates complexity
```

### Modular Generation
Each component generated separately for review:
1. Data structures first
2. Core algorithms second
3. Utilities third
4. Tests fourth

## Troubleshooting

### PDF Extraction Fails
- Install `pdftotext`: `brew install poppler` (Mac) or `apt-get install poppler-utils` (Linux)
- Or install Python package: `pip install PyPDF2`
- Or provide text file directly

### Paper Analysis Unclear
- Skill will ask for clarification
- Provide specific section to focus on
- Supply additional context about algorithm

### Generated Code Has Issues
- Review and modify generated code
- Add more tests
- Optimize implementations
- Submit feedback for skill improvement

## Skill Architecture

```
paper-to-code/
├── SKILL.md                    # Main skill definition (Claude Code reads this)
├── helpers/
│   └── document_processor.py   # PDF extraction fallback
├── templates/                  # (Reserved for future templates)
└── README.md                   # This file
```

## Comparison with DeepCode

This skill replicates DeepCode's functionality but:

| Feature | DeepCode | Paper-to-Code Skill |
|---------|----------|---------------------|
| Interface | Streamlit web UI | Claude Code |
| Agents | Multi-agent system | Single Claude session |
| GitHub repos | Downloads & indexes | Not included (simpler) |
| Output | Separate workspace | User-specified directory |
| MCP servers | Required | Uses Claude Code tools |

## Future Enhancements

- [ ] Support for multiple programming languages (JS, Java, C++)
- [ ] GitHub repository reference analysis (optional)
- [ ] Interactive refinement of generated code
- [ ] Jupyter notebook generation
- [ ] Automatic paper dataset download
- [ ] Performance optimization suggestions

## Contributing

To improve this skill:
1. Test with various papers
2. Report issues or unclear generations
3. Suggest template improvements
4. Add support for more frameworks

## License

MIT License

## Acknowledgments

Inspired by the DeepCode project's multi-agent research-to-code system.

## Version

**v1.1.0** - Updated with QuantAgent implementation learnings

- ✅ Complete PDF to code pipeline
- ✅ Python code generation with proper dataclass patterns
- ✅ Comprehensive testing including edge cases
- ✅ Full documentation
- ✅ Built-in edge case handling (division by zero, NaN/Inf prevention)
- ✅ Tested with QuantAgent paper (29/29 tests passing)

**Key Improvements:**
- Added `field(default_factory=...)` pattern for mutable dataclass defaults
- Enhanced edge case handling (empty data, constant values, division by zero)
- Improved testing templates with NaN/Inf checks
- Better uv virtual environment setup instructions

---

**Ready to transform research papers into code? Let Claude Code do the work!**
