#!/usr/bin/env bash
# Claude Code status line — agnoster-style powerline segments
# time+user | path | git branch | model | context | spend
# Palette: Catppuccin Macchiato

input=$(cat)

# ── Data extraction ────────────────────────────────────────────────────────────
model=$(echo "$input" | jq -r '.model.display_name // ""')
model_id=$(echo "$input" | jq -r '.model.id // ""')
cwd=$(echo "$input" | jq -r '.cwd // .workspace.current_dir // empty')
[ -z "$cwd" ] && cwd="$PWD"

used_pct=$(echo "$input"      | jq -r '.context_window.used_percentage      // empty')
remaining_pct=$(echo "$input" | jq -r '.context_window.remaining_percentage // empty')
total_in=$(echo "$input"      | jq -r '.context_window.total_input_tokens   // 0')
total_out=$(echo "$input"     | jq -r '.context_window.total_output_tokens  // 0')

if echo "$model_id" | grep -qi "opus"; then
  cost_in_per_m=15.0; cost_out_per_m=75.0
elif echo "$model_id" | grep -qi "haiku"; then
  cost_in_per_m=0.80; cost_out_per_m=4.0
else
  cost_in_per_m=3.0;  cost_out_per_m=15.0
fi

spend=$(awk -v in_tok="$total_in" -v out_tok="$total_out" \
            -v cpm_in="$cost_in_per_m" -v cpm_out="$cost_out_per_m" \
  'BEGIN { printf "%.4f", (in_tok/1000000*cpm_in) + (out_tok/1000000*cpm_out) }')

# ── Path (abbreviate home dir) ─────────────────────────────────────────────────
display_path="${cwd/#$HOME/\~}"

# ── Git branch ─────────────────────────────────────────────────────────────────
branch=""
git_dirty=0
if git -C "$cwd" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  branch=$(git -C "$cwd" branch --show-current 2>/dev/null)
  [ -z "$branch" ] && branch=$(git -C "$cwd" rev-parse --short HEAD 2>/dev/null)
  [ -n "$(git -C "$cwd" status --porcelain 2>/dev/null)" ] && git_dirty=1
fi

# ── Colour helpers (24-bit truecolor) ─────────────────────────────────────────
bg()    { printf "\033[48;2;%s;%s;%sm" "$1" "$2" "$3"; }
fg()    { printf "\033[38;2;%s;%s;%sm" "$1" "$2" "$3"; }
bgreset() { printf "\033[49m"; }
rset()  { printf "\033[0m"; }

# Palette (Catppuccin Macchiato)
BASE="36 39 58"        # #24273a — time/user segment bg, dark text elsewhere
TEXT="202 211 245"     # #cad3f5 — username
YELLOW="238 212 159"   # #eed49f — time value, git dirty bg
BLUE="138 173 244"     # #8aadf4 — path bg
GREEN="166 218 149"    # #a6da95 — git clean bg, context ≤60%
MAUVE="198 160 246"    # #c6a0f6 — model bg
PEACH="245 169 127"    # #f5a97f — spend bg
RED="237 135 150"      # #ed8796 — context >85%

ARROW=$''
BRANCH_ICON=$''

# ── Context colour ────────────────────────────────────────────────────────────
ctx_color="$GREEN"
if [ -n "$used_pct" ]; then
  int_used=$(printf "%.0f" "$used_pct")
  if   [ "$int_used" -gt 85 ]; then ctx_color="$RED"
  elif [ "$int_used" -gt 60 ]; then ctx_color="$YELLOW"
  fi
fi

# ── Segment machinery ──────────────────────────────────────────────────────────
# Tracks the previous segment's bg so the arrow can fade from it.
PREV_BG=""

arrow_to() {
  local next_bg="$1"
  if [ -n "$PREV_BG" ]; then
    eval "fg $PREV_BG"
    eval "bg $next_bg"
    printf "%s" "$ARROW"
  fi
}

segment() {
  local bg_color="$1" fg_color="$2" content="$3"
  arrow_to "$bg_color"
  eval "bg $bg_color"
  eval "fg $fg_color"
  printf " %s " "$content"
  PREV_BG="$bg_color"
}

close() {
  eval "fg $PREV_BG"
  bgreset
  printf "%s" "$ARROW"
  rset
}

# ── Compose status line ───────────────────────────────────────────────────────
time_str=$(date +%H:%M)
user_str="${USER:-$(whoami)}"
segment "$BASE" "$YELLOW" "[$time_str]"
# username in a lighter text color, same bg segment (no arrow between)
eval "fg $TEXT"; printf "%s " "$user_str"

segment "$BLUE" "$BASE" "$display_path"

if [ -n "$branch" ]; then
  if [ "$git_dirty" -eq 1 ]; then
    segment "$YELLOW" "$BASE" "$BRANCH_ICON $branch"
  else
    segment "$GREEN" "$BASE" "$BRANCH_ICON $branch"
  fi
fi

[ -n "$model" ] && segment "$MAUVE" "$BASE" "$model"

if [ -n "$used_pct" ] && [ -n "$remaining_pct" ]; then
  int_used=$(printf "%.0f" "$used_pct")
  segment "$ctx_color" "$BASE" "ctx ${int_used}%"
fi

segment "$PEACH" "$BASE" "\$${spend}"

close
