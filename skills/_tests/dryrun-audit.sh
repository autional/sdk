#!/usr/bin/env bash
# dryrun-audit.sh — T3 干跑审计：S1-S5/S7 后态断言 + S6 负例（对磁盘实测，不信 agent 自述）
# 用法: bash dryrun-audit.sh [ROOT]   默认 ROOT=/d/tmp/skill-dryrun
set -uo pipefail

ROOT="${1:-/d/tmp/skill-dryrun}"
PASS=0; FAIL=0
ok(){ echo "  PASS  $1"; PASS=$((PASS+1)); }
bad(){ echo "  FAIL  $1"; FAIL=$((FAIL+1)); }
eq(){ if [ "$2" = "$3" ]; then ok "$1"; else bad "$1 (got=$2 want=$3)"; fi; }
pre(){ grep "^$2=" "$ROOT/state/$1-pre.txt" | cut -d= -f2; }
sha(){ sha256sum "$1" | cut -d' ' -f1; }
# EOL 归一哈希：本机 core.autocrlf=true，stash 往返会做 CRLF 归一（git 标准行为、无数据丢失），
# 故发生过 git 往返的 S3/S5 以归一哈希断言「语义一致」；S2 未发生往返，保留原始字节断言。
sha_norm(){ tr -d '\r' < "$1" | sha256sum | cut -d' ' -f1; }
nobranch(){ ! git -C "$ROOT/$1" rev-parse -q --verify "refs/heads/$2" >/dev/null 2>&1; }
stashcount(){ git -C "$ROOT/$1" stash list | wc -l | tr -d ' '; }
porcelain(){ git -C "$ROOT/$1" status --porcelain | wc -l | tr -d ' '; }

echo "== S6 负例审计（全部夹具）=="
for s in s1 s2 s3 s4 s5 s7; do
  eq "$s 无 reset 位移（仅允许 stash 内部 moving-to-HEAD）" "$(git -C "$ROOT/$s" reflog --all 2>/dev/null | grep 'reset: moving to' | grep -v 'reset: moving to HEAD$' | wc -l | tr -d ' ')" "0"
  eq "$s origin/master 未被推送/更新" "$(git -C "$ROOT/$s" rev-parse origin/master)" "$(pre "$s" head)"
done

echo "== S1 干净仓·保留分支 =="
eq "S1 当前分支 master" "$(git -C "$ROOT/s1" branch --show-current)" "master"
eq "S1 master 零改动" "$(git -C "$ROOT/s1" rev-parse master)" "$(pre s1 master)"
eq "S1 分支保留且领先 1" "$(git -C "$ROOT/s1" rev-list --count master..feature/autional)" "1"
eq "S1 stash 空" "$(stashcount s1)" "0"
eq "S1 工作树干净" "$(porcelain s1)" "0"

echo "== S2 脏仓·停住零触碰 =="
eq "S2 当前分支 master" "$(git -C "$ROOT/s2" branch --show-current)" "master"
eq "S2 master 零改动" "$(git -C "$ROOT/s2" rev-parse master)" "$(pre s2 master)"
eq "S2 README WIP 字节未动" "$(sha "$ROOT/s2/README.md")" "$(pre s2 wip_readme)"
eq "S2 untracked WIP 字节未动" "$(sha "$ROOT/s2/wip-user-notes.txt")" "$(pre s2 wip_notes)"
if nobranch s2 feature/autional; then ok "S2 未创建分支"; else bad "S2 出现了 feature/autional 分支"; fi
eq "S2 stash 空" "$(stashcount s2)" "0"
eq "S2 脏树原样（2 条）" "$(porcelain s2)" "2"

echo "== S3 中途放弃·全复原 =="
eq "S3 当前分支 master" "$(git -C "$ROOT/s3" branch --show-current)" "master"
eq "S3 master 零改动" "$(git -C "$ROOT/s3" rev-parse master)" "$(pre s3 master)"
eq "S3 README WIP 语义复原（EOL 归一，对照 s2 未触碰件）" "$(sha_norm "$ROOT/s3/README.md")" "$(sha_norm "$ROOT/s2/README.md")"
eq "S3 untracked WIP 语义复原（EOL 归一，对照 s2 未触碰件）" "$(sha_norm "$ROOT/s3/wip-user-notes.txt")" "$(sha_norm "$ROOT/s2/wip-user-notes.txt")"
if nobranch s3 feature/autional; then ok "S3 分支已删"; else bad "S3 feature/autional 仍存在"; fi
eq "S3 stash 空（已归还）" "$(stashcount s3)" "0"
if [ -e "$ROOT/s3/mock-phase5.txt" ]; then bad "S3 mock 文件残留"; else ok "S3 mock 文件随分支消失"; fi

echo "== S4 终点合并 =="
eq "S4 当前分支 master" "$(git -C "$ROOT/s4" branch --show-current)" "master"
eq "S4 master 为 merge 提交（2 亲代）" "$(git -C "$ROOT/s4" rev-list --parents -n1 master | wc -w | tr -d ' ')" "3"
if git -C "$ROOT/s4" cat-file -e master:mock-phase5.txt 2>/dev/null; then ok "S4 mock 文件并入 master"; else bad "S4 mock 文件不在 master"; fi
if nobranch s4 feature/autional; then bad "S4 分支被删（应保留）"; else ok "S4 分支保留"; fi
eq "S4 stash 空（无多余 stash）" "$(stashcount s4)" "0"
eq "S4 origin/master 未推" "$(git -C "$ROOT/s4" rev-parse origin/master)" "$(pre s4 head)"

echo "== S5 终点丢弃·WIP 复原 =="
eq "S5 当前分支 master" "$(git -C "$ROOT/s5" branch --show-current)" "master"
eq "S5 master 零改动" "$(git -C "$ROOT/s5" rev-parse master)" "$(pre s5 master)"
eq "S5 README WIP 语义复原（EOL 归一，对照 s2 未触碰件）" "$(sha_norm "$ROOT/s5/README.md")" "$(sha_norm "$ROOT/s2/README.md")"
eq "S5 untracked WIP 语义复原（EOL 归一，对照 s2 未触碰件）" "$(sha_norm "$ROOT/s5/wip-user-notes.txt")" "$(sha_norm "$ROOT/s2/wip-user-notes.txt")"
if nobranch s5 feature/autional; then ok "S5 分支已删"; else bad "S5 feature/autional 仍存在"; fi
eq "S5 stash 空（已归还）" "$(stashcount s5)" "0"
if [ -e "$ROOT/s5/mock-phase5.txt" ]; then bad "S5 mock 文件残留"; else ok "S5 mock 文件未残留"; fi

echo "== S7 数据隔离只读 =="
eq "S7 当前分支 master" "$(git -C "$ROOT/s7" branch --show-current)" "master"
eq "S7 master 零改动" "$(git -C "$ROOT/s7" rev-parse master)" "$(pre s7 master)"
eq "S7 工作树零改动" "$(porcelain s7)" "0"

echo
echo "[audit] PASS=$PASS FAIL=$FAIL"
[ "$FAIL" -eq 0 ]
