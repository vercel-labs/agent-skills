---
name: bulkcut-coach
description: Fitness and diet tracking tool. Use when the user wants to analyze food photos for calories, log workouts, calculate metabolism (BMR/TDEE), get daily calorie summaries, or generate training/diet plans. Invoked with /bulkcut-coach.
user-invocable: true
license: MIT
---

# BulkCut Coach - Fitness & Diet Tracker

Uses Gemini 3 Flash (via OpenRouter) for food photo analysis and personalized planning.

## How to Use

All commands run from the project root. Parse the user's natural language and call the appropriate command via Bash.

### Food Photo Analysis
When user shares a food image path:
```bash
python scripts/app.py photo <image_path>
```

### Text Meal Logging
When user describes what they ate:
```bash
python scripts/app.py meal "<description>"
```

### Workout Logging
When user describes their training (exercises, sets, reps, weight), do NOT use the interactive `train` command. Instead call Python directly:
```bash
python -c "
import sys; sys.path.insert(0, 'scripts')
from training import log_training
r = log_training([
    {'name': '<exercise>', 'sets': <n>, 'reps': <n>, 'weight_kg': <n>},
])
print(f'Calories burned: {r[\"calories_burned\"]} kcal')
"
```
Parse the user's natural language into the exercise list. Examples:
- "4x4 squat at 112.5kg" → `{'name': 'Back Squat', 'sets': 4, 'reps': 4, 'weight_kg': 112.5}`
- "3x2 power clean 67.5kg" → `{'name': 'Power Clean', 'sets': 3, 'reps': 2, 'weight_kg': 67.5}`

### Body Metrics
When user provides height/weight/age/gender/body fat:
```bash
python -c "
import sys; sys.path.insert(0, 'scripts')
from metabolism import set_metrics
p = set_metrics(<height_cm>, <weight_kg>, <age>, '<gender>', <body_fat_pct_or_None>)
print(f'BMR: {p[\"bmr\"]} kcal/day\nTDEE: {p[\"tdee\"]} kcal/day')
"
```

### Goal Setting
```bash
python scripts/app.py goal <cut|bulk|maintain>
```

### Daily Summary
```bash
python scripts/app.py summary
```

### Generate Plan
```bash
python scripts/app.py plan
```

### History
```bash
python scripts/app.py history
```
