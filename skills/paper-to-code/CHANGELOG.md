# Changelog

All notable changes to the paper-to-code skill are documented here.

## [1.1.0] - 2025-12-21

### Added - Based on QuantAgent Implementation Testing

#### Dataclass Best Practices
- Added guidance for using `field(default_factory=...)` for mutable defaults
- Included proper import pattern: `from dataclasses import dataclass, field`
- Added examples showing correct vs incorrect dataclass patterns
- Documented the `ValueError: mutable default` error and how to fix it

**Example added to SKILL.md:**
```python
# ✅ CORRECT
@dataclass
class Config:
    items: list = field(default_factory=list)
    nested: OtherConfig = field(default_factory=OtherConfig)
    symbols: list = field(default_factory=lambda: ["BTC-USD", "NQ=F"])

# ❌ WRONG - Will cause ValueError
@dataclass
class Config:
    items: list = []  # Error!
    nested: OtherConfig = OtherConfig()  # Error!
```

#### Edge Case Handling Patterns
- Added comprehensive edge case handling section
- Division by zero pattern (check both zero, then denominator)
- Empty/insufficient data handling
- Flat/constant value handling (e.g., RSI with no price movement)
- NaN/Inf prevention checks

**Key pattern added:**
```python
# Check BOTH zero first (special case)
if numerator == 0 and denominator == 0:
    return neutral_value

# Then check denominator alone
if denominator == 0:
    return max_value

return numerator / denominator
```

#### Enhanced Testing Templates
- Added `test_constant_values()` for flat data scenarios
- Added `test_no_nan_or_inf()` to catch NaN/Inf results
- Added `test_insufficient_data()` for minimum data requirements
- Added `test_division_by_zero_handling()` for edge cases
- Enhanced testing checklist with 6 critical categories

**Testing categories now include:**
- ✅ Basic functionality
- ✅ Edge cases (empty, insufficient, constant)
- ✅ Division by zero scenarios
- ✅ NaN/Inf handling
- ✅ Paper compliance
- ✅ Algorithm step verification

#### Virtual Environment Setup
- Improved uv installation instructions
- Added virtual environment creation and activation steps
- Added multiple PDF extraction library installations

### Changed

#### Code Generation Templates
- Updated import statements to include `field` from dataclasses
- Added inline comments about mutable defaults in template
- Enhanced validation methods with edge case checks

#### SKILL.md Structure
- Added "Common Python Patterns & Pitfalls" section at end
- Enhanced Step 6 (code generation) with dataclass guidance
- Enhanced Step 7 (testing) with comprehensive edge case tests
- Updated version to 1.1.0

### Fixed

#### Real-World Issues from QuantAgent Implementation

1. **Dataclass Mutable Default Error**
   - **Error**: `ValueError: mutable default <class 'TradingConfig'> for field trading is not allowed: use default_factory`
   - **File**: `/Users/joannastew/projects/QuantTrader/src/config/settings.py`
   - **Fix**: Changed `trading: TradingConfig = TradingConfig()` to `trading: TradingConfig = field(default_factory=TradingConfig)`
   - **Now taught in skill**: Template includes correct pattern

2. **RSI Edge Case - Flat Prices**
   - **Error**: Test expected RSI=50.0 for flat prices, got 100.0
   - **File**: `/Users/joannastew/projects/QuantTrader/src/core/indicators.py`
   - **Fix**: Added check for `avg_gain == 0 and avg_loss == 0` before checking `avg_loss == 0`
   - **Now taught in skill**: Division by zero pattern handles this case

### Testing Results

Successfully tested with QuantAgent paper (arXiv:2509.09995):
- **29/29 tests passing** ✅
- Generated: 8 Python modules, 2 test files, 1 example, full documentation
- Implemented: Algorithm 1 (slope-aware trend detection), 5 technical indicators
- All edge cases handled correctly

### Documentation

- Updated README.md with new features
- Added changelog (this file)
- Updated skill metadata to v1.1.0
- Added "Last Updated: Based on QuantAgent implementation testing" note

### Examples

Added real-world examples from QuantAgent implementation:

**RSI Calculation with Edge Cases:**
```python
# If both are zero (flat prices), return neutral
if avg_gain == 0 and avg_loss == 0:
    return 50.0

# If only avg_loss is zero, return 100 (all gains, no losses)
if avg_loss == 0:
    return 100.0

rs = avg_gain / avg_loss
rsi = 100 - (100 / (1 + rs))
```

**Configuration with Nested Dataclasses:**
```python
@dataclass
class QuantAgentConfig:
    trading: TradingConfig = field(default_factory=TradingConfig)
    llm: LLMConfig = field(default_factory=LLMConfig)
    symbols: list = field(default_factory=lambda: ["BTC-USD", "NQ=F"])
```

---

## [1.0.0] - 2025-12-20

### Initial Release

- Complete PDF to code pipeline
- Paper analysis with algorithm extraction
- Python code generation
- Basic testing templates
- Documentation generation
- Support for arXiv, URLs, and local PDFs
- Integration with Claude Code
- uv package management

---

## Future Improvements

Planned for future versions:

- [ ] Multi-language support (JavaScript, Java, C++)
- [ ] GitHub repository reference integration
- [ ] Interactive code refinement
- [ ] Jupyter notebook generation
- [ ] Automatic dataset download
- [ ] Performance profiling templates
- [ ] CI/CD configuration generation
