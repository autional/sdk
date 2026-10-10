#!/usr/bin/env bash
# dryrun-prepare.sh — T3 干跑 fixture 准备
# 用法: bash dryrun-prepare.sh [ROOT]   默认 ROOT=/d/tmp/skill-dryrun
# 夹具来源：本地 takenote fork 克隆（默认分支 master；origin/HEAD→origin/master 已核）。
#           origin 指到不存在的本地路径 —— 任何 push 会立即失败（纯安全网，不依赖网络）。
set -euo pipefail

ROOT="${1:-/d/tmp/skill-dryrun}"
case "$ROOT" in
  /d/tmp/*) ;;
  *) echo "ROOT 必须在 /d/tmp 下（防误删）"; exit 1 ;;
esac

SRC="D:/ws/ai-onboarding-lab/takenote"

mkdir -p "$ROOT/state"
for s in s1 s2 s3 s4 s5 s7; do
  rm -rf "$ROOT/$s"
  git clone --quiet "$SRC" "$ROOT/$s"
  git -C "$ROOT/$s" checkout --quiet master
  git -C "$ROOT/$s" branch -D feature/autional >/dev/null 2>&1 || true
  git -C "$ROOT/$s" remote set-head origin master >/dev/null
  git -C "$ROOT/$s" remote set-url origin "$ROOT/__no-push-remote__"
done

# 脏树变体：s2/s3/s5 追加用户 WIP（tracked 修改 + untracked 新文件）
for s in s2 s3 s5; do
  printf '\n## Local WIP (dry-run fixture)\n' >> "$ROOT/$s/README.md"
  printf 'user scratch notes\n' > "$ROOT/$s/wip-user-notes.txt"
done

# 记录前态（master 指向 + WIP 双文件内容哈希）
for s in s1 s2 s3 s4 s5 s7; do
  {
    echo "fixture=$s"
    echo "master=$(git -C "$ROOT/$s" rev-parse master)"
    echo "head=$(git -C "$ROOT/$s" rev-parse HEAD)"
    if [ -f "$ROOT/$s/wip-user-notes.txt" ]; then
      echo "wip_readme=$(sha256sum "$ROOT/$s/README.md" | cut -d' ' -f1)"
      echo "wip_notes=$(sha256sum "$ROOT/$s/wip-user-notes.txt" | cut -d' ' -f1)"
    fi
  } > "$ROOT/state/$s-pre.txt"
done

echo "[prep] fixtures ready under $ROOT"
for s in s1 s2 s3 s4 s5 s7; do
  printf '%s  HEAD=%s  default=%s\n' "$s" \
    "$(git -C "$ROOT/$s" branch --show-current)" \
    "$(git -C "$ROOT/$s" symbolic-ref --short refs/remotes/origin/HEAD)"
done
