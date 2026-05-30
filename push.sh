#!/usr/bin/env bash
# Update "Last updated" timestamp in index.html, then git add + commit + push.
# Uses whatever git remote & auth is already configured in your terminal
# (SSH key, HTTPS credentials, GitHub CLI, dll — sama yang dipakai `git push` biasa).
#
# Usage:
#   ./push.sh                       # auto commit message "update: <timestamp>"
#   ./push.sh "fix audio bug"       # custom commit message

set -e

cd "$(dirname "$0")"

# ---- 0. Sanity checks ---------------------------------------------------
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: bukan dalam folder git repo"
  exit 1
fi

REMOTE_URL="$(git remote get-url origin 2>/dev/null || echo '')"
BRANCH="$(git branch --show-current)"

if [ -z "$REMOTE_URL" ]; then
  echo "ERROR: belum ada remote 'origin'. Set dulu:"
  echo "  git remote add origin <url-github>"
  exit 1
fi

echo "Repo:   $REMOTE_URL"
echo "Branch: $BRANCH"
echo

# ---- 1. Bump timestamp in index.html ------------------------------------
TIMESTAMP="$(date '+%Y-%m-%d %H:%M')"
TARGET="index.html"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found"
  exit 1
fi

sed -i.bak -E "s|(<span class=\"app-version-line\"[^>]*>)[^<]*(</span>)|\1${TIMESTAMP}\2|" "$TARGET"
rm -f "${TARGET}.bak"

echo "Bumped timestamp to: ${TIMESTAMP}"

# ---- 2. Show what changed -----------------------------------------------
echo
echo "--- Changes ---"
git status --short

if git diff --cached --quiet && git diff --quiet; then
  echo
  echo "Tidak ada perubahan. Hanya timestamp yang diupdate."
fi

# ---- 3. Commit + push ---------------------------------------------------
MSG="${1:-update: ${TIMESTAMP}}"

echo
echo "Commit: ${MSG}"
echo

git add -A
git commit -m "${MSG}" || { echo "Tidak ada yang di-commit (nothing to commit)."; exit 0; }

# Push dengan -u kalau branch belum punya upstream, kalau sudah pakai push biasa
if git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
  git push
else
  echo "Setting upstream untuk branch '${BRANCH}'..."
  git push -u origin "${BRANCH}"
fi

echo
echo "Done. Pushed to ${REMOTE_URL} (${BRANCH})"
