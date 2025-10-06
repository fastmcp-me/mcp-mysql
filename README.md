[![Add to Cursor](https://fastmcp.me/badges/cursor_dark.svg)](https://fastmcp.me/MCP/Details/1259/mysql)
[![Add to VS Code](https://fastmcp.me/badges/vscode_dark.svg)](https://fastmcp.me/MCP/Details/1259/mysql)
[![Add to Claude](https://fastmcp.me/badges/claude_dark.svg)](https://fastmcp.me/MCP/Details/1259/mysql)
[![Add to ChatGPT](https://fastmcp.me/badges/chatgpt_dark.svg)](https://fastmcp.me/MCP/Details/1259/mysql)
[![Add to Codex](https://fastmcp.me/badges/codex_dark.svg)](https://fastmcp.me/MCP/Details/1259/mysql)
[![Add to Gemini](https://fastmcp.me/badges/gemini_dark.svg)](https://fastmcp.me/MCP/Details/1259/mysql)

# MCP MySQL Server

A Model Context Protocol (MCP) server for MySQL databases, including support for AWS RDS and other cloud MySQL instances. This server provides comprehensive database management capabilities through a standardized MCP interface.

> 📋 **Quick Start for VS Code Users:** See [VSCODE_SETUP.md](VSCODE_SETUP.md) for step-by-step VS Code and GitHub Copilot integration instructions.

## Features

- ✅ **Database Connection Management**: Connect to local MySQL or cloud instances (AWS RDS, Google Cloud SQL, etc.)
- ✅ **Query Execution**: Execute SQL queries with prepared statement support
- ✅ **Schema Inspection**: List databases, tables, and describe table structures
- ✅ **Index Management**: View table indexes and statistics
- ✅ **Security**: Secure connection handling with SSL support
- ✅ **Error Handling**: Comprehensive error reporting and connection management

## Installation

### From NPM (Recommended)

```bash
npm install -g @sajithrw/mcp-mysql@1.0.0
```

Or run ad‑hoc without global install using `npx` (shown later in config).

### From Source

```bash
git clone https://github.com/sajithrw/mcp-mysql.git
cd mcp-mysql
npm install
npm run build
```

## Configuration

### VS Code (mcp.json) Setup (Recommended)

Create (or update) `.vscode/mcp.json` in your project or in your global VS Code user settings folder. Use the published package via `npx` so you always invoke the correct version.

```json
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

Then:
1. Reload VS Code window (Command Palette: "Developer: Reload Window").
2. Open Command Palette and run: "MCP: Start Server" (pick `mcp-mysql`).
3. Use Copilot / MCP clients to call tools (e.g., ask to list tables).

> Previous `settings.json` based `github.copilot.advanced.mcp` configuration is deprecated in favor of `mcp.json` discovery.

### Alternative: Local Build Path

If working from a local clone/build instead of the published package:

```json
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

### Using with Claude Desktop

Add the server to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "mysql": {
      "command": "npx",
      "args": ["@sajithrw/mcp-mysql@1.0.0"],
      "env": {
        "MYSQL_HOST": "localhost",
        "MYSQL_USER": "your_username",
        "MYSQL_PASSWORD": "your_password"
      }
    }
  }
}
```

### Using with MCP Inspector

For testing and development:

```bash
npx @modelcontextprotocol/inspector npx @sajithrw/mcp-mysql@1.0.0
```

## Using with VS Code and GitHub Copilot

Once configured, you can use the MySQL MCP server with GitHub Copilot in VS Code to interact with your databases using natural language.

### Example Interactions

1. **Database Exploration:**
   - "Show me all tables in the database"
   - "Describe the structure of the users table"
   - "What indexes are on the products table?"

2. **Data Analysis:**
   - "Show me the top 10 customers by order count"
   - "Find all users created in the last 30 days"
   - "Get statistics about the orders table"

3. **Schema Management:**
   - "List all databases on this server"
   - "Show me table sizes and row counts"
   - "Find tables with specific column names"

### Step-by-Step (Recap)

1. Create `.vscode/mcp.json` with config above.
2. Reload VS Code window.
3. Run "MCP: Start Server".
4. Use Copilot Chat / MCP-aware client to issue requests.

### Troubleshooting Quick Tips

- Ensure the package version (`1.0.0`) matches what you intend to use.
- If the server won't start, run it manually: `npx @sajithrw/mcp-mysql@1.0.0` to see logs.
- Verify environment variables are present (you can also place them in a `.env` if your shell loads them before launching VS Code).

## Available Tools

### 1. `mysql_connect`

Connect to a MySQL database.

**Parameters:**
- `host` (required): MySQL server hostname or IP address
- `port` (optional): MySQL server port (default: 3306)
- `user` (required): Database username
- `password` (required): Database password
- `database` (optional): Database name to connect to
- `ssl` (optional): Use SSL connection (default: false)

**Example:**
```json
{
  "host": "localhost",
  "port": 3306,
  "user": "myuser",
  "password": "mypassword",
  "database": "mydb",
  "ssl": false
}
```

### 2. `mysql_query`

Execute a SQL query on the connected database.

**Parameters:**
- `query` (required): SQL query to execute
- `parameters` (optional): Array of parameters for prepared statements

**Examples:**

Simple query:
```json
{
  "query": "SELECT * FROM users LIMIT 10"
}
```

Prepared statement:
```json
{
  "query": "SELECT * FROM users WHERE age > ? AND city = ?",
  "parameters": ["25", "New York"]
}
```

### 3. `mysql_list_databases`

List all databases on the MySQL server.

**Parameters:** None

### 4. `mysql_list_tables`

List all tables in the current or specified database.

**Parameters:**
- `database` (optional): Database name (uses current database if not specified)

### 5. `mysql_describe_table`

Get the structure/schema of a specific table.

**Parameters:**
- `table` (required): Table name to describe
- `database` (optional): Database name (uses current database if not specified)

### 6. `mysql_show_indexes`

Show indexes for a specific table.

**Parameters:**
- `table` (required): Table name to show indexes for
- `database` (optional): Database name (uses current database if not specified)

### 7. `mysql_get_table_stats`

Get statistics about a table (row count, size, etc.).

**Parameters:**
- `table` (required): Table name to get statistics for
- `database` (optional): Database name (uses current database if not specified)

### 8. `mysql_disconnect`

Disconnect from the MySQL database.

**Parameters:** None

## Common Use Cases

### 1. Connecting to AWS RDS

```json
{
  "host": "mydb.abc123.us-west-2.rds.amazonaws.com",
  "port": 3306,
  "user": "admin",
  "password": "mypassword",
  "database": "production",
  "ssl": true
}
```

### 2. Exploring Database Schema

1. Connect to database using `mysql_connect`
2. List all databases with `mysql_list_databases`
3. List tables with `mysql_list_tables`
4. Describe specific tables with `mysql_describe_table`
5. Check indexes with `mysql_show_indexes`

### 3. Data Analysis

1. Connect to database
2. Execute analytical queries with `mysql_query`
3. Get table statistics with `mysql_get_table_stats`

## Security Considerations

- **Credentials**: Never hardcode database credentials. Use environment variables or secure configuration management.
- **SSL/TLS**: Always use SSL when connecting to production databases or cloud instances.
- **Permissions**: Use database users with minimal required permissions.
- **Query Validation**: The server uses prepared statements to prevent SQL injection.

## Environment Variables

You can set default connection parameters using environment variables:

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=myuser
export MYSQL_PASSWORD=mypassword
export MYSQL_DATABASE=mydb
export MYSQL_SSL=true
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm run test
```

### Development Mode

```bash
npm run dev
```

## Troubleshooting

### Connection Issues

1. **Connection Refused**: Check that MySQL server is running and accessible
2. **Authentication Failed**: Verify username and password
3. **SSL Errors**: Ensure SSL is properly configured on both client and server
4. **Timeout**: Check network connectivity and firewall settings

### Common Error Messages

- `"Not connected to MySQL"`: Use `mysql_connect` before executing other commands
- `"Query execution failed"`: Check SQL syntax and table/column names
- `"Connection failed"`: Verify connection parameters and network connectivity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- [GitHub Issues](https://github.com/sajithrw/mcp-mysql/issues)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
