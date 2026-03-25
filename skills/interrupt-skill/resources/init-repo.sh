#!/usr/bin/env bash
# init-repo.sh — 初始化中断记录 git 仓库
# 被 /interrupt-init 调用，幂等设计

set -euo pipefail

REPO_PATH="${1:-$HOME/w/interrupts}"
REMOTE_URL="${2:-}"

# 创建目录结构
mkdir -p "$REPO_PATH/active" "$REPO_PATH/archived"

# 添加 .gitkeep 以保证空目录被 git 追踪
for dir in active archived; do
  [ -f "$REPO_PATH/$dir/.gitkeep" ] || touch "$REPO_PATH/$dir/.gitkeep"
done

cd "$REPO_PATH"

# git init（幂等）
if [ ! -d .git ]; then
  git init
  echo "✓ git init 完成"
else
  echo "✓ git 仓库已存在，跳过 init"
fi

# .gitignore
if [ ! -f .gitignore ]; then
  cat > .gitignore << 'EOF'
.DS_Store
*.swp
*~
EOF
  echo "✓ .gitignore 已创建"
fi

# 首次提交
if ! git log --oneline -1 &>/dev/null; then
  git add -A
  git commit -m "init: 中断记录仓库"
  echo "✓ 首次提交完成"
fi

# 配置 remote（如有）
if [ -n "$REMOTE_URL" ]; then
  if git remote get-url origin &>/dev/null; then
    CURRENT_URL=$(git remote get-url origin)
    if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
      git remote set-url origin "$REMOTE_URL"
      echo "✓ remote origin 已更新为 $REMOTE_URL"
    else
      echo "✓ remote origin 已配置，跳过"
    fi
  else
    git remote add origin "$REMOTE_URL"
    echo "✓ remote origin 已添加: $REMOTE_URL"
  fi
  git push -u origin "$(git branch --show-current)" 2>/dev/null || echo "⚠ push 失败，可能需要手动推送"
fi

echo ""
echo "仓库就绪: $REPO_PATH"
echo "  active/   — 存放中断记录"
echo "  archived/ — 恢复后归档"
