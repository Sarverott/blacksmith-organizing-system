#!/usr/bin/env bash
# Locate BOS workshops. First line: active workshop root.
# Remaining lines: all other workshops found (home + /media partitions).
set -euo pipefail

active=""

if [[ -n "${BOS_WORKSHOP:-}" && -d "$BOS_WORKSHOP" ]]; then
  active="$BOS_WORKSHOP"
else
  dir="$PWD"
  while [[ "$dir" != "/" ]]; do
    if [[ "$(basename "$dir")" == "__WORKSHOP" ]]; then
      active="$dir"
      break
    fi
    dir="$(dirname "$dir")"
  done
fi

if [[ -z "$active" && -d "$HOME/__WORKSHOP" ]]; then
  active="$HOME/__WORKSHOP"
fi

[[ -n "$active" ]] && echo "$active"

{
  [[ -d "$HOME/__WORKSHOP" ]] && echo "$HOME/__WORKSHOP"
  [[ -d /media ]] && find /media -maxdepth 4 -type d -name __WORKSHOP 2>/dev/null
} | sort -u | grep -vxF "${active:-/nonexistent}" || true
