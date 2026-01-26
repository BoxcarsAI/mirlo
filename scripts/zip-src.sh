#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/src.zip}"

cd "$ROOT"

# Remove existing archive to avoid appending.
rm -f "$OUT"

zip -r "$OUT" src -x 'src/.git/*' 'src/**/.git/*'

echo "Wrote $OUT"
