# Update "Last updated" timestamp in index.html, then git add + commit + push.
# Native PowerShell - pakai git credentials yang sudah cached di Windows Credential Manager.
#
# Usage:
#   .\push.ps1                       # auto commit message
#   .\push.ps1 "fix audio bug"       # custom commit message
#
# Kalau dapat error "execution policy", jalankan sekali:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

param([string]$Message)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# ---- 0. Sanity checks ----------------------------------------------------
git rev-parse --is-inside-work-tree 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "ERROR: bukan dalam folder git repo" -ForegroundColor Red
  exit 1
}

$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
  Write-Host "ERROR: belum ada remote 'origin'" -ForegroundColor Red
  exit 1
}
$branch = git branch --show-current

Write-Host "Repo:   $remoteUrl"
Write-Host "Branch: $branch"
Write-Host ""

# ---- 1. Bump timestamp in index.html -------------------------------------
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$target = Join-Path $PSScriptRoot "index.html"

if (-not (Test-Path $target)) {
  Write-Host "ERROR: $target tidak ditemukan" -ForegroundColor Red
  exit 1
}

$content = [System.IO.File]::ReadAllText($target)
$pattern = '(<span class="app-version-line"[^>]*>)[^<]*(</span>)'
$replacement = '${1}' + $timestamp + '${2}'
$newContent = [regex]::Replace($content, $pattern, $replacement)

if ($newContent -eq $content) {
  Write-Host "Warning: pattern app-version-line tidak ditemukan di index.html" -ForegroundColor Yellow
} else {
  # Write UTF-8 without BOM (matches typical web file format)
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($target, $newContent, $utf8NoBom)
  Write-Host "Bumped timestamp to: $timestamp" -ForegroundColor Green
}

# ---- 2. Show what changed ------------------------------------------------
Write-Host ""
Write-Host "--- Changes ---"
git status --short
Write-Host ""

# ---- 3. Commit + push ----------------------------------------------------
$msg = if ($Message) { $Message } else { "update: $timestamp" }
Write-Host "Commit: $msg"
Write-Host ""

git add -A

git commit -m "$msg" 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "Tidak ada yang di-commit (nothing to commit)." -ForegroundColor Yellow
  exit 0
}

# Push with upstream if branch doesn't have one
git rev-parse --abbrev-ref --symbolic-full-name "@{u}" 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
  git push
} else {
  Write-Host "Setting upstream untuk branch '$branch'..."
  git push -u origin $branch
}

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Done. Pushed to $remoteUrl ($branch)" -ForegroundColor Green
} else {
  Write-Host ""
  Write-Host "Push gagal - cek error di atas." -ForegroundColor Red
  exit $LASTEXITCODE
}
