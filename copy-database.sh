#! /run/current-system/sw/bin/sh
HOST=$(hostname)

echo $HOST

if [ $HOST="thinkpad" ]; then
  echo "thinkpad"
  scp pi:/var/tmp/bun-sveltekit-ecowitt.db.sqlite3 /var/tmp/bun-sveltekit-ecowitt.db.sqlite3
else
  scp thinkpad:/var/tmp/bun-sveltekit-ecowitt.db.sqlite3 /var/tmp/bun-sveltekit-ecowitt.db.sqlite3
fi