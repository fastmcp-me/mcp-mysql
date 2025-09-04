# Quick Start Guide: Using MCP MySQL Server with VS Code and GitHub Copilot

## Prerequisites

- VS Code (latest) with GitHub Copilot extension (or another MCP-capable extension)
- Node.js 18+ (LTS recommended)
- Access to a MySQL database (local or cloud)

## Setup Steps

### 1. Install (or Use via npx)

You can either rely on `npx` (no global install) or install globally.

**Option A: Use npx (no install)**
```bash
npx @sajithrw/mcp-mysql@1.0.0 --help
```

**Option B: Global install**
```bash
npm install -g @sajithrw/mcp-mysql@1.0.0
```

### 2. Create `.vscode/mcp.json`

Inside your project root (create the `.vscode` folder if missing):

```jsonc
// .vscode/mcp.json
{
  "servers": {
    "mcp-mysql": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "@sajithrw/mcp-mysql@1.0.0"
      ],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_PORT": "3306",
        "MYSQL_USER": "your_username",
        "MYSQL_PASSWORD": "your_password",
        "MYSQL_DATABASE": "your_database"
      }
    }
  }
}
```

> Put only non-sensitive defaults in `mcp.json`. For secrets, prefer your shell environment or a local `.env` (not committed) that your shell loads before launching VS Code.

### Local Development Instead of Published Package

If you're iterating on the repo locally:

```jsonc
{
  "servers": {
    "mcp-mysql": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mcp-mysql/build/index.js"],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_USER": "your_username",
        "MYSQL_PASSWORD": "your_password"
      }
    }
  }
}
```

### 3. Reload VS Code

After creating or editing `mcp.json`: 
- Open Command Palette → `Developer: Reload Window`.

### 4. Start the MCP Server

1. Command Palette → `MCP: Start Server`.
2. Select `mcp-mysql`.
3. Check the output/log panel for successful start (it should list available tools).

### 5. Use in Copilot Chat

Open Copilot Chat and try prompts like:
- "List all databases"
- "Describe the users table"
- "Show indexes on orders"

The MCP tools (e.g. `mysql_list_tables`, `mysql_query`) will be invoked behind the scenes.

## Environment Variables

Instead of (or in addition to) `env` in `mcp.json`, export variables in your shell profile:

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=your_username
export MYSQL_PASSWORD=your_password
export MYSQL_DATABASE=your_database
```

Restart VS Code (or your terminal) so the environment is inherited.

## Updating the Server Version

When a new version is published, just bump the version in the `args` entry:
```json
"args": ["@sajithrw/mcp-mysql@1.0.1"]
```
Reload window and restart the MCP server.

## Deprecated: settings.json Approach

Previous documentation used `github.copilot.advanced.mcp` in `settings.json`. This project now recommends `mcp.json` discovery for clarity and simpler multi-server setups.

## Troubleshooting

| Issue | Tips |
|-------|------|
| Server not listed | Ensure `mcp.json` path is `.vscode/mcp.json` and reloaded window. |
| Fails to start | Run manually: `npx @sajithrw/mcp-mysql@1.0.0` to see errors. |
| Auth/Access errors | Test credentials with `mysql` CLI or a GUI first. |
| Timeouts | Check network / firewall; verify host and port. |
| SSL needed | Set `MYSQL_SSL=true` in environment or pass via a future parameter (if implemented). |

## Manual Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx @sajithrw/mcp-mysql@1.0.0
```

Then invoke tools from the Inspector UI.

## Next Steps

- Explore advanced queries through Copilot Chat.
- Combine tool outputs with code generation in your workspace.
- File issues or feature requests on GitHub.

For more detail see the main [README.md](README.md).
