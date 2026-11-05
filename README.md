# Thicket plugins

Plugins that connect AI assistants to [Thicket](https://www.thickethq.com), project management software, through its hosted MCP server at `https://www.thickethq.com/api/mcp`. Each plugin is a thin manifest: sign-in is OAuth 2.1 in your browser, the assistant works with your own access, and you choose Read-only access or Full access on Thicket's approval screen.

| Plugin | For | Path |
|---|---|---|
| `thicket` | Cursor and Grok Bot, through the Cursor Marketplace | `plugins/cursor/thicket` |
| Thicket - Project Management | ChatGPT, through OpenAI's plugin directory | `plugins/openai/thicket` |

The Cursor Marketplace index is `.cursor-plugin/marketplace.json` at the root of this repository. The `thicket` command-line tool and the Claude Code plugin live in [thicket-cli](https://github.com/thicket-hq/thicket-cli).

## Try a plugin before it is listed

- **Cursor**: copy `plugins/cursor/thicket` to `~/.cursor/plugins/local/thicket`, run **Developer: Reload Window**, open **Customize**, and click **Authenticate** on the Thicket row. Or open the one-click install link on [thickethq.com/ai](https://www.thickethq.com/ai).
- **Grok Bot**: ask "Add a custom MCP server called Thicket at https://www.thickethq.com/api/mcp", then sign in on the card.
- **ChatGPT**: the plugin is public in ChatGPT's plugin directory as Thicket - Project Management.

Setup guides, permissions and troubleshooting: [Connect ChatGPT, Claude and AI Apps to Thicket with MCP](https://www.thickethq.com/help/mcp).

## Checks

`node bin/validate.mjs` checks that the index and the manifests agree, the MCP server address, the logo, the licenses and the copy. CI runs it on every push and pull request.

## License

MIT, see [LICENSE](LICENSE). The Thicket name and logo identify the product and are not granted by the license.
