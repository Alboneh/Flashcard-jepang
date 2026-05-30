"""
Generate local TTS audio files for all vocabulary in data/database.js.

Uses Microsoft Edge's neural voices (free, no API key, very natural).
File hashes mirror tts-cache.js so the app finds them automatically.

Setup:
    pip install edge-tts

Run from project root:
    python tools/generate-audio.py

Options:
    --force         Re-generate even if MP3 already exists
    --jp-voice X    Override Japanese voice (default: ja-JP-NanamiNeural)
    --id-voice X    Override Indonesian voice (default: id-ID-GadisNeural)
    --list-voices   Print all available voices and exit

Voice options:
    Japanese:   ja-JP-NanamiNeural (F, friendly) | ja-JP-KeitaNeural (M, calm)
    Indonesian: id-ID-GadisNeural (F)            | id-ID-ArdiNeural (M)
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import re
import sys
from pathlib import Path

# Force UTF-8 stdout so Japanese text and symbols print without crashing
# on Windows cp1252 consoles.
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

try:
    import edge_tts
except ImportError:
    sys.stderr.write("ERROR: edge-tts not installed. Run: pip install edge-tts\n")
    sys.exit(1)


ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / 'data' / 'database.js'
AUDIO_DIR = ROOT / 'assets' / 'audio'

DEFAULT_JP_VOICE = 'ja-JP-NanamiNeural'
DEFAULT_ID_VOICE = 'id-ID-GadisNeural'

# Limit concurrent edge-tts requests (free service — don't hammer it)
CONCURRENCY = 6


# ---- Database parser (matches database.js entry format) -----------------

ENTRY_RE = re.compile(
    r'\{jp:"([^"]*)",rom:"([^"]*)",id:"([^"]*)",cat:"([^"]*)"\}'
)


def parse_database() -> list[dict]:
    text = DB_PATH.read_text(encoding='utf-8')
    entries = []
    for m in ENTRY_RE.finditer(text):
        entries.append({
            'jp': m.group(1),
            'rom': m.group(2),
            'id': m.group(3),
            'cat': m.group(4),
        })
    return entries


# ---- Text cleanup (mirror of cleanForTTS in flashcard_kosakata_bab1_10.js)

JAPANESE_CHARS_RE = re.compile(r'[぀-ヿ一-鿿]')


def clean_for_tts(text: str, lang: str) -> str:
    if not text:
        return ''
    if lang != 'id':
        return text
    text = re.sub(r'\([^)]*\)', '', text)
    text = re.sub(r'\[[^\]]*\]', '', text)
    text = JAPANESE_CHARS_RE.sub('', text)
    text = re.sub(r'[~～]', 'ini', text)
    text = re.sub(r'\s+([,.!?:;])', r'\1', text)
    text = re.sub(r'([,.!?:;])\1+', r'\1', text)
    text = re.sub(r'^[\s,.!?:;]+', '', text)
    text = re.sub(r'[\s,]+$', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# ---- Hash function (mirror of hashText in tts-cache.js) -----------------

def hash_text(text: str, lang: str) -> str:
    data = f'{lang}::{text}'.encode('utf-8')
    return hashlib.sha256(data).hexdigest()[:16]


# ---- Generation ---------------------------------------------------------

async def generate_one(
    text: str,
    voice: str,
    output_path: Path,
    force: bool = False,
) -> str:
    """Returns 'generated', 'skipped', or 'failed:<msg>'."""
    if not force and output_path.exists() and output_path.stat().st_size > 0:
        return 'skipped'
    output_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        comm = edge_tts.Communicate(text, voice)
        await comm.save(str(output_path))
        return 'generated'
    except Exception as e:
        # Don't leave partial files behind
        try:
            if output_path.exists():
                output_path.unlink()
        except OSError:
            pass
        return f'failed:{e}'


async def list_voices():
    voices = await edge_tts.list_voices()
    ja = [v for v in voices if v['Locale'].startswith('ja')]
    id_ = [v for v in voices if v['Locale'].startswith('id')]
    print('--- Japanese voices ---')
    for v in ja:
        print(f"  {v['ShortName']:<28}  {v['Gender']:<8}  {v.get('FriendlyName', '')}")
    print('\n--- Indonesian voices ---')
    for v in id_:
        print(f"  {v['ShortName']:<28}  {v['Gender']:<8}  {v.get('FriendlyName', '')}")


async def run(args):
    entries = parse_database()
    print(f'Parsed {len(entries)} vocabulary entries from {DB_PATH.relative_to(ROOT)}\n')

    # Build the full job list (deduplicated — same text+lang only generated once)
    seen: set[tuple[str, str]] = set()
    jobs: list[tuple[str, str, str, Path]] = []  # (text, lang, voice, path)

    for entry in entries:
        jp = entry['jp']
        if jp:
            key = ('ja', jp)
            if key not in seen:
                seen.add(key)
                h = hash_text(jp, 'ja')
                jobs.append((jp, 'ja', args.jp_voice, AUDIO_DIR / 'ja' / f'{h}.mp3'))
        id_clean = clean_for_tts(entry['id'], 'id')
        if id_clean:
            key = ('id', id_clean)
            if key not in seen:
                seen.add(key)
                h = hash_text(id_clean, 'id')
                jobs.append((id_clean, 'id', args.id_voice, AUDIO_DIR / 'id' / f'{h}.mp3'))

    print(f'{len(jobs)} unique audio files to consider.\n')

    counts = {'generated': 0, 'skipped': 0, 'failed': 0}
    sem = asyncio.Semaphore(CONCURRENCY)
    total = len(jobs)
    done = 0

    async def worker(text, lang, voice, path):
        nonlocal done
        async with sem:
            result = await generate_one(text, voice, path, force=args.force)
        done += 1
        prefix = f'[{done:>4}/{total}]'
        if result == 'generated':
            counts['generated'] += 1
            print(f'{prefix} [OK]   {lang.upper()}  {text[:60]}')
        elif result == 'skipped':
            counts['skipped'] += 1
        else:
            counts['failed'] += 1
            print(f'{prefix} [FAIL] {lang.upper()}  {text[:60]}  ({result})')

    await asyncio.gather(*[worker(*j) for j in jobs])

    print()
    print(f'Generated: {counts["generated"]}')
    print(f'Skipped (already exists): {counts["skipped"]}')
    print(f'Failed: {counts["failed"]}')
    print(f'\nOutput: {AUDIO_DIR.relative_to(ROOT)}/{{ja,id}}/<hash>.mp3')


def main():
    parser = argparse.ArgumentParser(description='Generate local TTS audio for kosakata flashcards.')
    parser.add_argument('--force', action='store_true', help='Re-generate even if file exists')
    parser.add_argument('--jp-voice', default=DEFAULT_JP_VOICE, help=f'Japanese voice (default: {DEFAULT_JP_VOICE})')
    parser.add_argument('--id-voice', default=DEFAULT_ID_VOICE, help=f'Indonesian voice (default: {DEFAULT_ID_VOICE})')
    parser.add_argument('--list-voices', action='store_true', help='Print available voices and exit')
    args = parser.parse_args()

    if args.list_voices:
        asyncio.run(list_voices())
        return

    asyncio.run(run(args))


if __name__ == '__main__':
    main()
