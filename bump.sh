#!/bin/sh
# Bump the asset cache-buster on EVERY page at once.
#
# Doing this by hand once left discord.html and giveaways.html stuck on an old
# version while index.html moved on: a find-and-replace for the current number
# silently skips any page already behind. This rewrites whatever number it
# finds, so the pages cannot drift apart again.
#
#   ./bump.sh          -> next version
#   ./bump.sh 42       -> that version
set -e
cur=$(sed -n 's/.*style\.css?v=\([0-9]*\).*/\1/p' index.html | head -1)
new=${1:-$((cur + 1))}
for f in *.html; do
  sed -i '' -E "s|(assets/(css/style\.css|js/main\.js))\?v=[0-9]+|\1?v=$new|g" "$f"
done
sed -i '' -E "s|style\.css\?v=[0-9]+|style.css?v=$new|" README.md
echo "$cur -> $new"
grep -h -o 'style\.css?v=[0-9]*' *.html | sort -u
