#!/usr/bin/env bash
# Update "Last updated" timestamp in index.html, then git add + commit + push.
#
# Usage:
#   ./push.sh                       # auto commit message "update: <timestamp>"
#   ./push.sh "fix audio bug"       # custom commit message

set -e

cd "$(dirname "$0")"

# ---- 1. Bump timestamp in index.html ------------------------------------
TIMESTAMP="$(date '+%Y-%m-%d %H:%M')"
TARGET="index.html"

if [ ! -f "$TARGET" ]; then
  echo "ERROR: $TARGET not found"
  exit 1
fi

# Replace the contents of <span class="app-version-line" ...>...</span>
sed -i.bak -E "s|(<span class=\"app-version-line\"[^>]*>)[^<]*(</span>)|\1${TIMESTAMP}\2|" "$TARGET"
rm -f "${TARGET}.bak"

echo "Bumped timestamp to: ${TIMESTAMP}"

# ---- 2. Show what changed -----------------------------------------------
echo
echo "--- Changes ---"
git status --short

# ---- 3. Commit + push ---------------------------------------------------
MSG="${1:-update: ${TIMESTAMP}}"

echo
echo "Commit message: ${MSG}"
echo

git add -A
git commit -m "${MSG}"
git push

echo
echo "Done. Pushed: ${MSG}"
