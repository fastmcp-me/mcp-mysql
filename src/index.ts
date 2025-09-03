#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  CallToolRequest,
  ListToolsRequest 
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import mysql from "mysql2/promise";

// Configuration schema
const ConfigSchema = z.object({
  host: z.string(),
  port: z.number().optional().default(3306),
  user: z.string(),
  password: z.string(),
  database: z.string().optional(),
  ssl: z.boolean().optional().default(false),
  connectionLimit: z.number().optional().default(10),
});

type Config = z.infer<typeof ConfigSchema>;

class MySQLMCPServer {
  private server: Server;
  private pool: mysql.Pool | null = null;
  private config: Config | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-mysql",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error: unknown) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private async cleanup(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  private async createConnection(config: Config): Promise<mysql.Pool> {
    try {
      const poolConfig: mysql.PoolOptions = {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        connectionLimit: config.connectionLimit,
        multipleStatements: false,
      };

      if (config.ssl) {
        poolConfig.ssl = {};
      }

      this.pool = mysql.createPool(poolConfig);

      // Test the connection
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();

      return this.pool;
    } catch (error) {
      throw new Error(`Failed to connect to MySQL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "mysql_connect",
            description: "Connect to a MySQL database with provided connection parameters",
            inputSchema: {
              type: "object",
              properties: {
                host: {
                  type: "string",
                  description: "MySQL server hostname or IP address",
                },
                port: {
                  type: "number",
                  description: "MySQL server port (default: 3306)",
                  default: 3306,
                },
                user: {
                  type: "string",
                  description: "Database username",
                },
                password: {
                  type: "string",
                  description: "Database password",
                },
                database: {
                  type: "string",
                  description: "Database name (optional)",
                },
                ssl: {
                  type: "boolean",
                  description: "Use SSL connection (default: false)",
                  default: false,
                },
              },
              required: ["host", "user", "password"],
            },
          },
          {
            name: "mysql_query",
            description: "Execute a SQL query on the connected MySQL database",
            inputSchema: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "SQL query to execute",
                },
                parameters: {
                  type: "array",
                  description: "Parameters for prepared statement (optional)",
                  items: {
                    type: "string",
                  },
                },
              },
              required: ["query"],
            },
          },
          {
            name: "mysql_list_databases",
            description: "List all databases on the MySQL server",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "mysql_list_tables",
            description: "List all tables in the current or specified database",
            inputSchema: {
              type: "object",
              properties: {
                database: {
                  type: "string",
                  description: "Database name (uses current database if not specified)",
                },
              },
            },
          },
          {
            name: "mysql_describe_table",
            description: "Get the structure/schema of a specific table",
            inputSchema: {
              type: "object",
              properties: {
                table: {
                  type: "string",
                  description: "Table name to describe",
                },
                database: {
                  type: "string",
                  description: "Database name (uses current database if not specified)",
                },
              },
              required: ["table"],
            },
          },
          {
            name: "mysql_show_indexes",
            description: "Show indexes for a specific table",
            inputSchema: {
              type: "object",
              properties: {
                table: {
                  type: "string",
                  description: "Table name to show indexes for",
                },
                database: {
                  type: "string",
                  description: "Database name (uses current database if not specified)",
                },
              },
              required: ["table"],
            },
          },
          {
            name: "mysql_get_table_stats",
            description: "Get statistics about a table (row count, size, etc.)",
            inputSchema: {
              type: "object",
              properties: {
                table: {
                  type: "string",
                  description: "Table name to get statistics for",
                },
                database: {
                  type: "string",
                  description: "Database name (uses current database if not specified)",
                },
              },
              required: ["table"],
            },
          },
          {
            name: "mysql_disconnect",
            description: "Disconnect from the MySQL database",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "mysql_connect":
            return await this.handleConnect(args);
          case "mysql_query":
            return await this.handleQuery(args);
          case "mysql_list_databases":
            return await this.handleListDatabases();
          case "mysql_list_tables":
            return await this.handleListTables(args);
          case "mysql_describe_table":
            return await this.handleDescribeTable(args);
          case "mysql_show_indexes":
            return await this.handleShowIndexes(args);
          case "mysql_get_table_stats":
            return await this.handleGetTableStats(args);
          case "mysql_disconnect":
            return await this.handleDisconnect();
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async handleConnect(args: any) {
    try {
      const config = ConfigSchema.parse(args);
      this.config = config;
      
      // Close existing connection if any
      if (this.pool) {
        await this.pool.end();
      }

      this.pool = await this.createConnection(config);
      
      return {
        content: [
          {
            type: "text",
            text: `Successfully connected to MySQL server at ${config.host}:${config.port}${config.database ? ` (database: ${config.database})` : ""}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleQuery(args: any) {
    if (!this.pool) {
      throw new Error("Not connected to MySQL. Use mysql_connect first.");
    }

    const { query, parameters = [] } = args;
    
    if (!query || typeof query !== "string") {
      throw new Error("Query is required and must be a string");
    }

    try {
      const [results, fields] = await this.pool.execute(query, parameters);
      
      // Handle different types of results
      if (Array.isArray(results)) {
        return {
          content: [
            {
              type: "text",
              text: `Query executed successfully. ${results.length} rows affected.\n\nResults:\n${JSON.stringify(results, null, 2)}`,
            },
          ],
        };
      } else {
        const resultInfo = results as mysql.ResultSetHeader;
        return {
          content: [
            {
              type: "text",
              text: `Query executed successfully.\nAffected rows: ${resultInfo.affectedRows}\nInserted ID: ${resultInfo.insertId || "N/A"}`,
            },
          ],
        };
      }
    } catch (error) {
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleListDatabases() {
    if (!this.pool) {
      throw new Error("Not connected to MySQL. Use mysql_connect first.");
    }

    try {
      const [results] = await this.pool.execute("SHOW DATABASES");
      return {
        content: [
          {
            type: "text",
            text: `Available databases:\n${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list databases: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleListTables(args: any) {
    if (!this.pool) {
      throw new Error("Not connected to MySQL. Use mysql_connect first.");
    }

    const { database } = args;
    let query = "SHOW TABLES";
    
    if (database) {
      query = `SHOW TABLES FROM \`${database}\``;
    }

    try {
      const [results] = await this.pool.execute(query);
      return {
        content: [
          {
            type: "text",
            text: `Tables${database ? ` in database '${database}'` : ""}:\n${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to list tables: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleDescribeTable(args: any) {
    if (!this.pool) {
      throw new Error("Not connected to MySQL. Use mysql_connect first.");
    }

    const { table, database } = args;
    
    if (!table) {
      throw new Error("Table name is required");
    }

    const fullTableName = database ? `\`${database}\`.\`${table}\`` : `\`${table}\``;

    try {
      const [results] = await this.pool.execute(`DESCRIBE ${fullTableName}`);
      return {
        content: [
          {
            type: "text",
            text: `Table structure for '${table}':\n${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to describe table: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleShowIndexes(args: any) {
    if (!this.pool) {
      throw new Error("Not connected to MySQL. Use mysql_connect first.");
    }

    const { table, database } = args;
    
    if (!table) {
      throw new Error("Table name is required");
    }

    const fullTableName = database ? `\`${database}\`.\`${table}\`` : `\`${table}\``;

    try {
      const [results] = await this.pool.execute(`SHOW INDEX FROM ${fullTableName}`);
      return {
        content: [
          {
            type: "text",
            text: `Indexes for table '${table}':\n${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to show indexes: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleGetTableStats(args: any) {
    if (!this.pool) {
      throw new Error("Not connected to MySQL. Use mysql_connect first.");
    }

    const { table, database } = args;
    
    if (!table) {
      throw new Error("Table name is required");
    }

    try {
      // Get table information from information_schema
      const dbCondition = database ? `AND TABLE_SCHEMA = '${database}'` : "";
      const query = `
        SELECT 
          TABLE_NAME,
          ENGINE,
          TABLE_ROWS,
          DATA_LENGTH,
          INDEX_LENGTH,
          DATA_FREE,
          AUTO_INCREMENT,
          CREATE_TIME,
          UPDATE_TIME,
          CHECK_TIME
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = '${table}' ${dbCondition}
      `;

      const [results] = await this.pool.execute(query);
      return {
        content: [
          {
            type: "text",
            text: `Statistics for table '${table}':\n${JSON.stringify(results, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get table statistics: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async handleDisconnect() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.config = null;
      return {
        content: [
          {
            type: "text",
            text: "Successfully disconnected from MySQL database",
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: "No active MySQL connection to disconnect",
          },
        ],
      };
    }
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MySQL MCP server running on stdio");
  }
}

const server = new MySQLMCPServer();
server.run().catch(console.error);
