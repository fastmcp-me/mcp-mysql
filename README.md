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
npm install -g mcp-mysql-server
```

### From Source

```bash
git clone https://github.com/your-username/mcp-mysql-server.git
cd mcp-mysql-server
npm install
npm run build
```

## Configuration

### Using with VS Code and GitHub Copilot

#### Method 1: Global Installation (Recommended)

1. **Install the server globally:**
```bash
npm install -g mcp-mysql-server
```

2. **Configure VS Code settings:**
Add to your VS Code `settings.json`:
```json
{
  "github.copilot.advanced": {
    "mcp": {
      "enabled": true,
      "servers": {
        "mysql": {
          "command": "mcp-mysql-server",
          "args": []
        }
      }
    }
  }
}
```

#### Method 2: Local Development Setup

1. **Clone and build locally:**
```bash
git clone <this-repo>
cd mcp-mysql-server
npm install
npm run build
```

2. **Configure VS Code with absolute path:**
```json
{
  "github.copilot.advanced": {
    "mcp": {
      "enabled": true,
      "servers": {
        "mysql": {
          "command": "node",
          "args": ["/absolute/path/to/mcp-mysql-server/build/index.js"]
        }
      }
    }
  }
}
```

#### Method 3: Using the included .vscode/mcp.json

This project includes a `.vscode/mcp.json` file that VS Code can automatically detect:

```json
{
  "servers": {
    "mcp-mysql-server": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"]
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
      "args": ["mcp-mysql-server"]
    }
  }
}
```

### Using with MCP Inspector

For testing and development:

```bash
npx @modelcontextprotocol/inspector npx mcp-mysql-server
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

### Step-by-Step Setup for VS Code

1. **Enable MCP in VS Code:**
   - Open VS Code settings (Cmd/Ctrl + ,)
   - Search for "copilot mcp"
   - Enable MCP support

2. **Install the server:**
   ```bash
   npm install -g mcp-mysql-server
   ```

3. **Configure connection:**
   - The server will prompt for database credentials when first used
   - Or set environment variables in your `.env` file

4. **Start using:**
   - Open any file in VS Code
   - Use Copilot chat and reference your database
   - The MCP server will handle database operations automatically

### VS Code Settings File Location

- **macOS:** `~/Library/Application Support/Code/User/settings.json`
- **Windows:** `%APPDATA%\Code\User\settings.json`
- **Linux:** `~/.config/Code/User/settings.json`

### Troubleshooting VS Code Integration

1. **MCP not working:**
   - Ensure GitHub Copilot extension is updated
   - Check that MCP is enabled in settings
   - Restart VS Code after configuration changes

2. **Server not found:**
   - Verify the command path is correct
   - Check that the server builds successfully (`npm run build`)
   - Use absolute paths if relative paths don't work

3. **Connection issues:**
   - Test the server separately with MCP Inspector
   - Verify database credentials and network connectivity
   - Check firewall settings

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

- [GitHub Issues](https://github.com/your-username/mcp-mysql-server/issues)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Related Projects

- [Model Context Protocol](https://github.com/modelcontextprotocol)
- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
