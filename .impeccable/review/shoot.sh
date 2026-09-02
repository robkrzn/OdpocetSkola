#!/bin/sh
# Sada snimok pre F5b: vsetkych pat pohladov na 375x667 zo ZIVEJ index.html.
# usage: sh .impeccable/review/shoot.sh <pred|po> [375 667]
set -e
TAG="${1:-pred}"; W="${2:-375}"; H="${3:-667}"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
OUT="d:/Projekty/OdpočetRoka/.impeccable/review/shots"
BASE="http://localhost:8765/.impeccable/review/live.html"
mkdir -p "$OUT"

shot () { # nazov, query
  "$CHROME" --headless=old --disable-gpu --hide-scrollbars --no-first-run \
    --virtual-time-budget=12000 --window-size="$W","$H" \
    --user-data-dir="$(mktemp -d)" \
    --screenshot="$OUT/$TAG-$1-${W}x${H}.png" "$BASE?$2&w=$W&h=$H" >/dev/null 2>&1
  echo "  $TAG-$1-${W}x${H}.png"
}

shot dnes        "v=dnes&s=fresh"
shot dnes-seria  "v=dnes&s=played"
shot uloha       "v=uloha&s=fresh"
shot vysledok    "v=vysledok&s=fresh&d=answer-all"
shot vykaz       "v=vykaz&s=played"
shot vykaz-prazdny "v=vykaz&s=fresh"
shot tabula      "v=tabula&s=fresh"
