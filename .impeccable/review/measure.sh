#!/bin/sh
# usage: sh .impeccable/review/measure.sh "v=dnes&s=fresh&sel=.corner|.btn" [W] [H]
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
W="${2:-375}"; H="${3:-667}"
"$CHROME" --headless=old --disable-gpu --hide-scrollbars --no-first-run --virtual-time-budget=12000 \
  --window-size="$W",900 --user-data-dir="$(mktemp -d)" --dump-dom \
  "http://localhost:8765/.impeccable/review/measure-live.html?$1&w=$W&h=$H" 2>/dev/null \
  | tr -d '\r' | awk '/<pre id="out">/{f=1} f{print} /<\/pre>/{if(f)exit}' \
  | sed -e 's/<pre id="out">//' -e 's/<\/pre>//' -e 's/&amp;/\&/g' -e 's/&lt;/</g' -e 's/&gt;/>/g'
