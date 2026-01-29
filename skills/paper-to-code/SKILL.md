---
name: paper-to-code
description: Transforms research papers (PDFs, URLs, arXiv links) into production-ready Python code implementations. Analyzes the paper to extract algorithms, methodologies, and formulas, creates an implementation plan, and generates a complete codebase with comprehensive tests and documentation. Use when the user wants to implement code from academic papers or technical documentation.
---

# Paper-to-Code Implementation Skill

This skill automatically converts research papers into working Python code implementations with tests and documentation.

## Requirements

This skill uses `uv` for fast, reliable Python package management:

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment (run this in the skill directory)
cd /path/to/paper-to-code
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install PDF extraction dependencies
uv pip install PyPDF2 pdfplumber pdfminer.six
```

**Note**: The virtual environment must be activated before running any paper extraction or code generation.

## Supported Input Formats

- **PDF files**: Local paths to PDF research papers
- **URLs**: Direct links to PDF files
- **arXiv**: arXiv.org paper IDs or URLs
- **Text**: Raw paper text (if already extracted)

## Complete Workflow

When a user provides a research paper, follow these steps in order:

---

### STEP 1: Get Output Directory

**ALWAYS ask the user where to save the implementation:**

```
"Where would you like me to save the implementation? (provide a directory path)"
```

Wait for user response. Use this path as `$OUTPUT_DIR` for all subsequent operations.

---

### STEP 2: Download and Extract Paper

#### For arXiv Papers:

```bash
# Extract arXiv ID from URL or use directly
# Example: https://arxiv.org/pdf/2509.09995.pdf → 2509.09995
ARXIV_ID="[extract from user input]"
PAPER_URL="https://arxiv.org/pdf/${ARXIV_ID}.pdf"

# Download PDF
curl -L "$PAPER_URL" -o paper.pdf

# Extract text (try pdftotext first, fall back to Python)
if command -v pdftotext &> /dev/null; then
    pdftotext -layout paper.pdf paper.txt
else
    python3 -c "
import PyPDF2
with open('paper.pdf', 'rb') as f:
    reader = PyPDF2.PdfReader(f)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
with open('paper.txt', 'w') as f:
    f.write(text)
"
fi
```

#### For Direct PDF URLs:

```bash
PAPER_URL="[user provided URL]"
curl -L "$PAPER_URL" -o paper.pdf
# ... same extraction as above
```

#### For Local PDF Files:

```bash
PDF_PATH="[user provided path]"
cp "$PDF_PATH" paper.pdf
# ... same extraction as above
```

---

### STEP 3: Analyze Paper

Read the extracted paper text and analyze it to extract structured information.

**Analysis Prompt for Claude:**

```
Analyze this research paper and extract the following information in JSON format:

{
  "title": "Full paper title",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Paper abstract",
  "main_contribution": "1-2 sentence summary of key contribution",

  "algorithms": [
    {
      "name": "Algorithm name (e.g., 'QuantAgent', 'Transformer')",
      "description": "What the algorithm does",
      "pseudocode": "Step-by-step pseudocode from paper",
      "complexity": {
        "time": "Time complexity (e.g., O(n log n))",
        "space": "Space complexity (e.g., O(n))"
      },
      "inputs": "Description of inputs",
      "outputs": "Description of outputs"
    }
  ],

  "formulas": [
    {
      "equation_number": "Equation reference from paper (e.g., 'Eq. 1', 'Equation 3')",
      "latex": "LaTeX representation of formula",
      "description": "What the formula calculates",
      "variables": {
        "variable_name": "what it represents"
      }
    }
  ],

  "methodology": {
    "approach": "Overall approach/framework",
    "key_steps": ["Step 1", "Step 2", "Step 3"],
    "novel_aspects": ["What's new compared to prior work"]
  },

  "implementation_requirements": {
    "dependencies": ["numpy", "pandas", "torch", "..."],
    "data_structures": ["lists", "graphs", "matrices", "..."],
    "key_classes": [
      {
        "name": "ClassName",
        "purpose": "What it does",
        "key_methods": ["method1", "method2"]
      }
    ]
  },

  "experiments": {
    "datasets": ["Dataset names used in paper"],
    "metrics": ["Accuracy", "F1-score", "..."],
    "baselines": ["Methods compared against"]
  },

  "suggested_structure": {
    "project_name": "lowercase_project_name",
    "modules": [
      {
        "name": "module_name",
        "files": ["file1.py", "file2.py"],
        "purpose": "What this module does"
      }
    ]
  }
}

Focus on extracting:
1. Complete algorithm pseudocode (copy exactly from paper)
2. All mathematical formulas with equation numbers
3. Specific implementation details
4. Any code snippets or examples in the paper
5. Evaluation metrics and expected results

Paper text:
[paste paper.txt contents here]
```

**Save the JSON response to `paper_analysis.json`**

---

### STEP 4: Create Implementation Plan

Based on the analysis, create a detailed implementation plan.

**Planning Prompt:**

```
Based on this paper analysis, create a comprehensive implementation plan for the project.

Analysis:
[paste paper_analysis.json here]

Generate a detailed plan including:

1. **Project Structure**: Complete directory tree with all files
2. **Implementation Order**: Which files to create first (dependencies first)
3. **Module Breakdown**: What each file should contain
4. **Testing Strategy**: What tests are needed
5. **Documentation Needs**: README sections, docstrings

Format as a structured plan with clear sections.
```

**Save the plan to `implementation_plan.txt`**

---

### STEP 5: Generate Directory Structure

```bash
cd "$OUTPUT_DIR"

# Read project name from analysis
PROJECT_NAME="[from paper_analysis.json: suggested_structure.project_name]"

# Create complete directory structure
mkdir -p ${PROJECT_NAME}/{src/{core,utils,config},tests,docs,examples}

# Create __init__.py files for Python packages
touch ${PROJECT_NAME}/src/__init__.py
touch ${PROJECT_NAME}/src/core/__init__.py
touch ${PROJECT_NAME}/src/utils/__init__.py
touch ${PROJECT_NAME}/src/config/__init__.py
touch ${PROJECT_NAME}/tests/__init__.py

# Create placeholder files
touch ${PROJECT_NAME}/requirements.txt
touch ${PROJECT_NAME}/setup.py
touch ${PROJECT_NAME}/README.md
touch ${PROJECT_NAME}/.gitignore

echo "✅ Directory structure created"
```

---

### STEP 6: Generate Core Implementation Files

For each module in the implementation plan, generate the code iteratively.

#### 6.1: Generate Core Algorithm Implementation

**File**: `src/core/algorithm.py` (or appropriate name from analysis)

**Code Generation Template:**

```python
"""
{algorithm_name} Implementation

Based on: {paper_title}
Authors: {authors}
Paper: {arxiv_url or paper_url}

{algorithm_description}

Complexity:
- Time: {time_complexity}
- Space: {space_complexity}
"""

from typing import List, Dict, Optional, Union, Tuple
from dataclasses import dataclass, field  # IMPORTANT: Include 'field' for mutable defaults
import numpy as np
# [other imports based on dependencies]

@dataclass
class {ConfigClassName}:
    \"\"\"
    Configuration for {algorithm_name}

    Attributes:
        [list key parameters from paper]
    \"\"\"
    param1: type = default_value
    param2: type = default_value
    # [more parameters]

    # IMPORTANT: For mutable defaults (list, dict, other dataclasses), use field(default_factory=...)
    # Example:
    # mutable_list: list = field(default_factory=list)
    # nested_config: OtherConfig = field(default_factory=OtherConfig)
    # mutable_dict: dict = field(default_factory=dict)


class {AlgorithmClassName}:
    \"\"\"
    {algorithm_description}

    This implements the algorithm described in {paper_citation}.

    Algorithm Steps (from paper):
    {paste_pseudocode_as_comments}

    Attributes:
        config: Configuration object
        [other attributes]
    \"\"\"

    def __init__(self, config: {ConfigClassName}):
        \"\"\"
        Initialize the {algorithm_name}.

        Args:
            config: Configuration object with algorithm parameters
        \"\"\"
        self.config = config
        # [initialization based on paper]

    def {main_method_name}(self, {inputs_with_types}) -> {output_type}:
        \"\"\"
        {method_description_from_paper}

        Algorithm (from paper):
        1. {step_1}
        2. {step_2}
        ...

        Args:
            {input_descriptions}

        Returns:
            {output_description}

        Raises:
            ValueError: If inputs are invalid
        \"\"\"
        # Input validation
        self._validate_inputs({inputs})

        # Step 1: {step_description}
        # [Equation {eq_number}]: {latex_formula}
        {implementation_of_step_1}

        # Step 2: {step_description}
        {implementation_of_step_2}

        # ... more steps

        return result

    def _validate_inputs(self, {inputs}) -> None:
        \"\"\"Validate input parameters.\"\"\"
        # [validation logic]
        pass

    # [Additional helper methods]


# IMPORTANT: Edge Case Handling Patterns
#
# When implementing algorithms, always handle these common edge cases:
#
# 1. Division by Zero:
#    if denominator == 0:
#        return default_value  # or raise ValueError with clear message
#
# 2. Empty/Insufficient Data:
#    if len(data) < minimum_required:
#        return neutral_default  # e.g., 50.0 for indicators, 0.0 for metrics
#
# 3. Flat/Constant Values (especially for financial indicators):
#    if all_values_equal:
#        return neutral_value  # e.g., RSI=50 for flat prices
#
# 4. NaN/Inf Values:
#    if np.isnan(result) or np.isinf(result):
#        return safe_default  # or raise informative error
#
# 5. Both numerator and denominator are zero:
#    if numerator == 0 and denominator == 0:
#        return neutral_value  # special case before checking denominator alone
```

**For each formula in the paper, add it as a comment above the implementation:**

```python
# Formula from paper (Eq. {number}):
# {latex_formula}
# Where: {variable_descriptions}
result = [Python implementation of formula]
```

#### 6.2: Generate Data Structures (if needed)

**File**: `src/core/data_structures.py`

Generate any custom data structures needed based on the paper.

#### 6.3: Generate Utilities

**File**: `src/utils/helpers.py`

Common utility functions (data loading, preprocessing, visualization, etc.)

---

### STEP 7: Generate Comprehensive Tests

**File**: `tests/test_{algorithm_name}.py`

```python
"""
Tests for {algorithm_name} implementation

Verifies the implementation matches the paper's claims and handles edge cases.
"""

import pytest
import numpy as np
from src.core.algorithm import {AlgorithmClass}, {ConfigClass}


class Test{AlgorithmName}Basic:
    \"\"\"Basic functionality tests.\"\"\"

    def setup_method(self):
        \"\"\"Set up test fixtures.\"\"\"
        self.config = {ConfigClass}(
            # [default test parameters]
        )
        self.algorithm = {AlgorithmClass}(self.config)

    def test_initialization(self):
        \"\"\"Test algorithm initializes correctly.\"\"\"
        assert self.algorithm is not None
        assert self.algorithm.config == self.config

    def test_{main_method}_basic(self):
        \"\"\"Test {main_method} with basic input.\"\"\"
        # Test case from paper if available
        input_data = [create test data]
        result = self.algorithm.{main_method}(input_data)

        # Assert expected behavior
        assert result is not None
        # [more assertions based on paper]

    def test_{main_method}_with_paper_example(self):
        \"\"\"Test with example from paper (if available).\"\"\"
        # [implement test using paper's example]
        pass


class Test{AlgorithmName}EdgeCases:
    \"\"\"Edge case and error handling tests.\"\"\"

    def test_empty_input(self):
        \"\"\"Test handling of empty input.\"\"\"
        config = {ConfigClass}()
        algorithm = {AlgorithmClass}(config)

        empty_data = np.array([])
        result = algorithm.{main_method}(empty_data)

        # Should return safe default, not crash
        assert result is not None
        # [verify it's a sensible default]

    def test_insufficient_data(self):
        \"\"\"Test with less data than required for algorithm.\"\"\"
        config = {ConfigClass}()
        algorithm = {AlgorithmClass}(config)

        # If algorithm needs 20 data points, test with 5
        insufficient_data = np.array([1, 2, 3, 4, 5])
        result = algorithm.{main_method}(insufficient_data)

        # Should handle gracefully with default value
        assert result is not None

    def test_constant_values(self):
        \"\"\"Test with all identical values (flat data).\"\"\"
        config = {ConfigClass}()
        algorithm = {AlgorithmClass}(config)

        # All values the same
        flat_data = np.ones(50) * 100.0
        result = algorithm.{main_method}(flat_data)

        # Should return neutral/default value, not NaN or error
        assert not np.isnan(result)
        # [additional assertions for specific expected behavior]

    def test_division_by_zero_handling(self):
        \"\"\"Test scenarios that could cause division by zero.\"\"\"
        # Create data that would cause denominator = 0
        # Verify it returns safe default instead of raising ZeroDivisionError
        pass

    def test_no_nan_or_inf(self):
        \"\"\"Test that calculations don't produce NaN or Inf.\"\"\"
        config = {ConfigClass}()
        algorithm = {AlgorithmClass}(config)

        # Test with various edge case inputs
        test_data = np.ones(50) * 100.0
        result = algorithm.{main_method}(test_data)

        assert not np.isnan(result), "Result should not be NaN"
        assert not np.isinf(result), "Result should not be Inf"

    def test_invalid_input(self):
        \"\"\"Test handling of invalid input types.\"\"\"
        with pytest.raises((ValueError, TypeError)):
            # [test that should raise error]
            pass

    def test_large_input(self):
        \"\"\"Test with large input to verify complexity.\"\"\"
        # [performance test]
        pass


class Test{AlgorithmName}PaperClaims:
    \"\"\"Tests to verify claims from the paper.\"\"\"

    def test_complexity_time(self):
        \"\"\"Verify time complexity matches paper's claim.\"\"\"
        # Run algorithm with varying input sizes
        # Measure execution time
        # Verify it matches stated complexity
        pass

    def test_accuracy_on_dataset(self):
        \"\"\"Test accuracy on dataset mentioned in paper.\"\"\"
        # If paper mentions specific dataset and results
        # Verify we can achieve similar results
        pass

    def test_formula_{equation_number}(self):
        \"\"\"Verify implementation of Equation {number}.\"\"\"
        # Test that formula is implemented correctly
        # Use known inputs/outputs if available from paper
        pass


# Integration tests
class Test{AlgorithmName}Integration:
    \"\"\"Integration tests for complete workflow.\"\"\"

    def test_end_to_end(self):
        \"\"\"Test complete algorithm workflow.\"\"\"
        # [full workflow test]
        pass
```

---

### STEP 8: Generate Configuration Files

#### 8.1: requirements.txt

```bash
cat > ${PROJECT_NAME}/requirements.txt << 'EOF'
# Core dependencies (from paper analysis)
[list dependencies from paper_analysis.json]

# Testing
pytest>=7.0.0
pytest-cov>=4.0.0

# Code quality
black>=23.0.0
flake8>=6.0.0
mypy>=1.0.0

# Documentation
sphinx>=6.0.0
EOF
```

#### 8.2: setup.py

```python
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="{project_name}",
    version="0.1.0",
    author="{paper_authors}",
    description="{paper_title} - Implementation",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="{paper_url}",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        # [list from requirements.txt]
    ],
)
```

#### 8.3: .gitignore

```bash
cat > ${PROJECT_NAME}/.gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
*.egg-info/
dist/
build/

# Testing
.pytest_cache/
.coverage
htmlcov/

# IDE
.vscode/
.idea/
*.swp
*.swo

# Data
data/
*.csv
*.pkl
EOF
```

---

### STEP 9: Generate Documentation

#### 9.1: README.md

```markdown
# {Project Name}

Implementation of "{paper_title}" by {authors}.

## Paper Reference

- **Title**: {title}
- **Authors**: {authors}
- **Paper**: [{arxiv_id}]({paper_url})
- **Abstract**: {abstract}

## Overview

{main_contribution}

This repository contains a complete Python implementation of the {algorithm_name} algorithm described in the paper.

## Installation

```bash
# Clone the repository
git clone [repository_url]
cd {project_name}

# Install dependencies
pip install -r requirements.txt

# Install package
pip install -e .
```

## Quick Start

```python
from src.core.algorithm import {AlgorithmClass}, {ConfigClass}

# Create configuration
config = {ConfigClass}(
    param1=value1,
    param2=value2
)

# Initialize algorithm
algorithm = {AlgorithmClass}(config)

# Run algorithm
result = algorithm.{main_method}(input_data)
```

## Algorithm Description

{methodology.approach}

### Key Steps

{methodology.key_steps as numbered list}

### Complexity

- **Time Complexity**: {time_complexity}
- **Space Complexity**: {space_complexity}

## Project Structure

```
{project_name}/
├── src/
│   ├── core/           # Core algorithm implementation
│   ├── utils/          # Utility functions
│   └── config/         # Configuration
├── tests/              # Comprehensive test suite
├── docs/               # Documentation
└── examples/           # Usage examples
```

## Implementation Details

### Algorithms

{list algorithms with descriptions}

### Key Formulas

{list formulas with equation numbers and descriptions}

## Testing

Run the test suite:

```bash
# Run all tests
pytest tests/

# Run with coverage
pytest tests/ --cov=src --cov-report=html

# Run specific test file
pytest tests/test_{algorithm_name}.py
```

## Paper Verification

This implementation includes tests that verify the claims made in the paper:

- ✅ Algorithm complexity matches paper claims
- ✅ Formulas implemented correctly
- ✅ [Additional verification based on paper]

## Examples

See `examples/` directory for usage examples.

## Citation

If you use this implementation, please cite the original paper:

```bibtex
@article{{citation_key},
  title={{{title}}},
  author={{{authors}}},
  journal={{{journal or arxiv}}},
  year={{{year}}}
}
```

## License

MIT License (or as specified by original paper)

## Acknowledgments

Implementation based on "{paper_title}" by {authors}.
```

---

### STEP 10: Generate Example Usage

**File**: `examples/basic_usage.py`

```python
"""
Basic usage example for {algorithm_name}

This example demonstrates how to use the {algorithm_name} implementation.
"""

from src.core.algorithm import {AlgorithmClass}, {ConfigClass}
import numpy as np


def main():
    # Example from paper (if available)
    print("=== {Algorithm Name} Example ===\n")

    # 1. Create configuration
    print("1. Creating configuration...")
    config = {ConfigClass}(
        # [parameters from paper's example]
    )

    # 2. Initialize algorithm
    print("2. Initializing algorithm...")
    algorithm = {AlgorithmClass}(config)

    # 3. Prepare input data
    print("3. Preparing input data...")
    input_data = [create example data matching paper]

    # 4. Run algorithm
    print("4. Running algorithm...")
    result = algorithm.{main_method}(input_data)

    # 5. Display results
    print("5. Results:")
    print(f"   {result}")

    # Additional examples if relevant
    print("\n=== Additional Examples ===")
    # [more examples]


if __name__ == "__main__":
    main()
```

---

### STEP 11: Validate Implementation

```bash
cd ${PROJECT_NAME}

# Check Python syntax
echo "Checking syntax..."
python -m py_compile src/**/*.py tests/**/*.py

# Run tests
echo "Running tests..."
pytest tests/ -v

# Check code quality (if black and flake8 installed)
if command -v black &> /dev/null; then
    echo "Formatting code..."
    black src/ tests/ examples/
fi

if command -v flake8 &> /dev/null; then
    echo "Checking code style..."
    flake8 src/ tests/ --max-line-length=100
fi

echo "✅ Validation complete!"
```

---

### STEP 12: Final Summary

Provide the user with a completion summary:

```
✅ Implementation Complete!

📁 Location: {OUTPUT_DIR}/{PROJECT_NAME}/

📊 Generated:
- {X} Python modules
- {Y} test files
- Complete documentation
- Example usage scripts

🧪 Tests: {number_of_tests} tests written

📚 Key Files:
- Main algorithm: src/core/algorithm.py
- Tests: tests/test_{algorithm_name}.py
- README: README.md
- Examples: examples/basic_usage.py

Next Steps:
1. Review the generated code
2. Run tests: cd {PROJECT_NAME} && pytest tests/
3. Try the examples: python examples/basic_usage.py
4. Customize as needed

Paper Reference: {paper_title} ({paper_url})
```

---

## Error Handling

### If PDF extraction fails:
- Try alternative extraction: `pdf2txt.py`, `pdfminer`, or manual Python extraction
- Ask user to provide text file directly
- Suggest using online PDF to text converters

### If paper analysis is unclear:
- Ask user for clarification on specific algorithms
- Request manual input for key components
- Generate basic structure and ask user to fill gaps

### If dependencies are unclear:
- Start with common packages (numpy, pandas)
- Generate requirements.txt with placeholders
- Ask user to specify missing dependencies after review

---

## Tips for Best Results

1. **Complex Papers**: For very long papers (>50 pages), consider processing in sections
2. **Multiple Algorithms**: Generate separate classes for each algorithm
3. **Data-Specific**: If paper uses specific datasets, note in README where to obtain them
4. **Reproducibility**: Include all hyperparameters and settings from paper
5. **Verification**: Always include tests that verify paper's claims when possible

---

## Customization

After generation, users can:
- Add more tests
- Optimize implementations
- Add visualization code
- Integrate with existing projects
- Add CLI interfaces
- Create Jupyter notebooks

---

## Common Python Patterns & Pitfalls

Based on extensive testing, here are critical patterns to follow:

### Dataclass Mutable Defaults ⚠️

**WRONG:**
```python
from dataclasses import dataclass

@dataclass
class Config:
    items: list = []  # ❌ ERROR: mutable default
    nested: OtherConfig = OtherConfig()  # ❌ ERROR: mutable default
    params: dict = {}  # ❌ ERROR: mutable default
```

**Error you'll get:**
```
ValueError: mutable default <class 'list'> for field items is not allowed: use default_factory
```

**CORRECT:**
```python
from dataclasses import dataclass, field

@dataclass
class Config:
    items: list = field(default_factory=list)  # ✅ CORRECT
    nested: OtherConfig = field(default_factory=OtherConfig)  # ✅ CORRECT
    params: dict = field(default_factory=dict)  # ✅ CORRECT

    # Immutable types are fine without field()
    value: float = 0.5  # ✅ OK
    name: str = "default"  # ✅ OK
```

**With custom defaults:**
```python
@dataclass
class TradingConfig:
    symbols: list = field(default_factory=lambda: ["BTC-USD", "NQ=F"])
    settings: dict = field(default_factory=lambda: {"leverage": 1.0})
```

### Edge Case Handling for Calculations

**Division by Zero Pattern:**
```python
def calculate_ratio(numerator, denominator):
    # Check BOTH zero first (special case)
    if numerator == 0 and denominator == 0:
        return 0.5  # Neutral value

    # Then check denominator alone
    if denominator == 0:
        return 1.0  # or appropriate max value

    return numerator / denominator
```

**Example from RSI calculation:**
```python
avg_gain = np.mean(gains[-period:])
avg_loss = np.mean(losses[-period:])

# If both are zero (flat prices), return neutral
if avg_gain == 0 and avg_loss == 0:
    return 50.0

# If only avg_loss is zero, return 100 (all gains, no losses)
if avg_loss == 0:
    return 100.0

rs = avg_gain / avg_loss
rsi = 100 - (100 / (1 + rs))
```

### Insufficient Data Handling

```python
def calculate_indicator(data, period=14):
    # Always check minimum data requirements
    if len(data) < period + 1:
        return neutral_default  # Return safe default, don't crash

    # Proceed with calculation
    result = compute(data[-period:])
    return result
```

### Import Pattern for Dataclasses

```python
# Always import 'field' when using dataclasses with defaults
from dataclasses import dataclass, field  # ✅ Include 'field'

# Not just:
from dataclasses import dataclass  # ❌ Missing 'field'
```

### Testing Checklist

When generating tests, ALWAYS include:

- ✅ **Basic functionality**: Does it work with normal inputs?
- ✅ **Edge cases**: Empty data, insufficient data, constant values
- ✅ **Division by zero**: All scenarios that could cause division by zero
- ✅ **NaN/Inf handling**: Verify no NaN or Inf in results
- ✅ **Paper compliance**: Verify implementation matches paper formulas
- ✅ **Algorithm steps**: Test each step of paper's algorithm individually

---

## Skill Metadata

**Created by**: Claude Code paper-to-code skill
**Version**: 1.1.0
**Supports**: Python 3.8+
**Best for**: Research papers with clear algorithms and methodologies
**Last Updated**: Based on QuantAgent implementation testing
