#!/bin/sh
# Hace que todos los jugadores conectados guarden y recarguen el juego con la versión nueva.
# Uso: ./forzar-actualizacion.sh "mensaje opcional para los jugadores"
cd "$(dirname "$0")"
MSG=$(printf '%s' "${1:-}" | sed 's/\\/\\\\/g; s/"/\\"/g')
printf '{"v": "%s", "msg": "%s"}\n' "$(date +%Y%m%d%H%M%S)" "$MSG" > assets/version.json
git add assets/version.json
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -qm "Forzar actualización de todos los jugadores

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01VqtAEViNG1esq8QcU2zFPh" && git push -q origin main && echo "Listo: en 1 o 2 minutos todos se actualizan."
