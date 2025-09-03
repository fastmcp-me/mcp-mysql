# Quick Start Guide: Using MCP MySQL Server with VS Code and GitHub Copilot

## Prerequisites

- VS Code with GitHub Copilot extension installed
- Node.js 17+ installed
- Access to a MySQL database (local or cloud)

## Setup Steps

### 1. Install the MCP MySQL Server

Choose one of these methods:

**Option A: Global Installation (Recommended)**
```bash
npm install -g mcp-mysql
```

**Option B: Local Development**
```bash
git clone https://github.com/sajithrw/mcp-mysql.git
cd mcp-mysql
npm install
npm run build
```

### 2. Configure VS Code

Add this to your VS Code `settings.json`:

```json
{
  "github.copilot.advanced": {
    "mcp": {
      "enabled": true,
      "servers": {
        "mysql": {
          "command": "mcp-mysql"
        }
      }
    }
  }
}
```

**For local development, use:**
```json
{
  "github.copilot.advanced": {
    "mcp": {
      "enabled": true,
      "servers": {
        "mysql": {
          "command": "node",
          "args": ["/full/path/to/mcp-mysql/build/index.js"]
        }
      }
    }
  }
}
```

### 3. Test the Setup

1. Open VS Code
2. Open GitHub Copilot Chat (Ctrl/Cmd + Shift + I)
3. Try asking: "Connect to my MySQL database and show me all tables"

### 4. Connect to Your Database

When Copilot needs to access your database, it will use the MCP server's `mysql_connect` tool. You can either:

**Option A: Use environment variables**
Create a `.env` file in your project:
```bash
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

**Option B: Provide connection details when prompted**
Copilot will ask for connection details when needed.

## Example Conversations with Copilot

### Database Exploration
- "Connect to my local MySQL database and list all tables"
- "Show me the structure of the users table"
- "What are the indexes on the products table?"

### Data Analysis
- "Find all customers who placed orders in the last 30 days"
- "Show me the top 10 best-selling products"
- "Get table statistics for the orders table"

### Schema Management
- "List all databases on this MySQL server"
- "Show me tables that contain the word 'user' in their name"
- "Describe all tables in the inventory database"

## Troubleshooting

### Common Issues

1. **"MCP server not found"**
   - Check that the command path is correct in settings.json
   - Verify the server is built: `npm run build`
   - Try using absolute paths

2. **"Database connection failed"**
   - Verify MySQL server is running
   - Check connection credentials
   - Ensure firewall allows connections

3. **"Copilot not using MCP"**
   - Restart VS Code after configuration changes
   - Check GitHub Copilot extension is updated
   - Verify MCP is enabled in settings

### Debug Steps

1. Test the MCP server directly:
   ```bash
   npx @modelcontextprotocol/inspector node build/index.js
   ```

2. Check VS Code Developer Console:
   - Help > Toggle Developer Tools
   - Look for MCP-related errors

3. Verify settings:
   - File > Preferences > Settings
   - Search for "copilot mcp"
   - Ensure it's enabled

## Next Steps

Once everything is working:

1. Try complex database queries through Copilot
2. Use Copilot to help analyze your data
3. Let Copilot help you write and optimize SQL queries
4. Explore schema relationships and database structure

## Support

- Check the main [README.md](README.md) for detailed documentation
- Test with MCP Inspector for debugging
- Verify your MySQL connection separately first
