# BOS as the agent's suit

BOS is also a Claude Code plugin, so an AI agent works *inside* the workshop,
not next to it. The plugin (`.claude-plugin/plugin.json`) brings:

| Part | What the agent gets |
| ---- | ------------------- |
| **Session brief** (`SessionStart` hook) | at the start of every session: the workshop, its role and mode, where the agent works (`forge / <scope> / <project>`), the House's boundaries (who rests and must never be called), the tools, the rules |
| **MCP tools** (`.claude-plugin/mcp.json` → `src/mcp.mjs`) | generated from the tool registry: every read-only tool as `<model>_<tool>` (`workshop_status`, `workshop_glossary`, `house_show`, `project_describe`, `project_plan`…). Writing tools are not offered: agents look and plan through MCP, and changing the workshop stays a conscious act on the command line |
| **`bos` on PATH** (`bin/bos`) | the whole CLI as a bare command |
| **Skills** (`skills/`) | `bos-workshop` and one skill per model (drafts, growing) |
| **Storylines** (`PostToolUse` and `SessionEnd` hooks) | the agent's sessions as events, and its shell commands as its own ttystory: `.BOS/storylines/ttystories/ttystory-<host>-claude-<session>.txt` (unixusat, cwd, command) |

The hooks never create a workshop and never block the agent. Outside a
workshop they stay silent.

## Install

From the local clone, so the plugin runs in place with its `node_modules`:

```
/plugin marketplace add ~/__WORKSHOP/forge/blacksmith-organization-system/bos-skillset
/plugin install bos@bos-skillset
```

Restart the session: the brief appears, and `/mcp` lists `bos`.
Installing from GitHub works for the skills. The hooks and MCP server need the
dependencies installed next to the plugin: [`TODO`] (e.g. `npm ci` into
`${CLAUDE_PLUGIN_DATA}` on first start).

## Why

Storylines exist to reuse command patterns and to teach AI to use the shell
the BOS way. With the suit, the agent's own work becomes part of that record,
next to the owner's ttystories. Treat agent ttystories like `.BOS/setup`:
shell history can contain secrets.
