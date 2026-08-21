#!/bin/sh
# Lance l'API (Node) et nginx dans le même conteneur. /bin/sh ici est
# busybox ash (image alpine) : pas de "wait -n", donc on surveille les deux
# process par polling et on les arrête ensemble si l'un des deux meurt, ou
# si le conteneur reçoit SIGTERM/SIGINT (tini est PID 1, voir Dockerfile).
set -e

trap 'kill -TERM "$NODE_PID" "$NGINX_PID" 2>/dev/null; wait; exit 0' TERM INT

node /app/server/index.mjs &
NODE_PID=$!

nginx -g 'daemon off;' &
NGINX_PID=$!

while kill -0 "$NODE_PID" 2>/dev/null && kill -0 "$NGINX_PID" 2>/dev/null; do
  sleep 1
done

kill -TERM "$NODE_PID" "$NGINX_PID" 2>/dev/null
wait
