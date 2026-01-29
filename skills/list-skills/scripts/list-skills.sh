#!/bin/bash
set -e

# List all installed Claude Code skills with their descriptions and usage
# Output: JSON array of skill information

SKILLS_DIR="${HOME}/.claude/skills"

if [ ! -d "$SKILLS_DIR" ]; then
    echo "[]"
    exit 0
fi

echo "["
first=true

for skill_dir in "$SKILLS_DIR"/*/; do
    [ -d "$skill_dir" ] || continue

    skill_name=$(basename "$skill_dir")
    skill_file="$skill_dir/SKILL.md"

    if [ -f "$skill_file" ]; then
        # Extract frontmatter description
        description=$(sed -n '/^---$/,/^---$/p' "$skill_file" | grep -E "^description:" | sed 's/^description: *//' | head -1)

        # If no frontmatter description, get first paragraph after title
        if [ -z "$description" ]; then
            description=$(sed -n '/^# /,/^$/p' "$skill_file" | tail -n +2 | head -1)
        fi

        # Escape quotes for JSON
        description=$(echo "$description" | sed 's/"/\\"/g' | tr -d '\n')

        if [ "$first" = true ]; then
            first=false
        else
            echo ","
        fi

        echo "  {"
        echo "    \"name\": \"$skill_name\","
        echo "    \"path\": \"$skill_dir\","
        echo "    \"description\": \"$description\""
        echo -n "  }"
    fi
done

echo ""
echo "]"
