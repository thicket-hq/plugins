# Thicket plugins

Public repository `thicket-hq/plugins`, owned by Vesperion Gate Inc. and
administered by `codeexplorio` like the other `thicket-hq` repositories
(workspace rules: `~/Programming/CLAUDE.md`). It holds the thin plugin
manifests that put Thicket's hosted MCP server (`https://www.thickethq.com/api/mcp`)
in the AI assistant directories. The plan that governs them is
`Apps/thicket/docs/agent-marketplaces-plan.md`; the submission kit is
`Apps/thicket/docs/mcp-directory-submission-kit.md`.

- `plugins/cursor/thicket`: the Cursor Marketplace plugin, which Cursor and
  Grok Bot read. `.cursor-plugin/plugin.json`, `mcp.json` with
  `"placement": "server"` (Grok Bot runs the server from the cloud), README,
  LICENSE, a 1024 px opaque logo. `.cursor-plugin/marketplace.json` at the
  root lists it; the x.ai / Cursor Marketplace application names this
  repository, and updates after listing are a re-index request to
  `marketplace-publishing@cursor.com`.
- `plugins/openai/thicket`: the ChatGPT plugin package. The portal takes an
  upload, so the manifest here is the text of the published package
  (version in `plugin.json`), kept so the two listings are maintained side
  by side.

The `thicket` command-line tool and the Claude Code plugin stay in
`thicket-cli`. Never put a plugin manifest (`plugin.json`, `.claude-plugin/`,
`.cursor-plugin/plugin.json`) at this repository's root: an indexer that
follows a manifest's `repository` link must find only the Cursor index here.
The plugins moved out of `thicket-cli` on 2026-11-04 for that reason, after
Grok Bot's catalog showed the Claude Code plugin for "thicket" (Cursor's
import of the plugin installed on the iMac, private to that account).

Everything here is public product copy: no competitor names (the validator
keeps its guard encoded), no em dashes in READMEs, skills or manifests, and
Thicket described by what it does. Checks: `node bin/validate.mjs`, no
dependencies; CI runs it on every push and pull request. There is no
deploy: a push to `main` is what the directories read, so commit straight
to `main` and never rewrite its history.
