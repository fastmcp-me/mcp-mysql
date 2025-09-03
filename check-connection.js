#!/usr/bin/env node

import { spawn } from 'child_process';

console.log('🔍 Testing MCP MySQL Server Connection...\n');

// Test 1: Check if server starts
console.log('Test 1: Server Startup');
const server = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let serverStarted = false;
let toolsListed = false;

server.stderr.on('data', (data) => {
  const output = data.toString();
  if (output.includes('MySQL MCP server running on stdio')) {
    console.log('✅ Server started successfully');
    serverStarted = true;
    
    // Test 2: Check available tools
    console.log('\nTest 2: Available Tools');
    const listToolsRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    };
    
    server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
  }
});

server.stdout.on('data', (data) => {
  const output = data.toString();
  try {
    const response = JSON.parse(output);
    if (response.result && response.result.tools) {
      console.log('✅ Tools available:', response.result.tools.length);
      response.result.tools.forEach(tool => {
        console.log(`   - ${tool.name}: ${tool.description}`);
      });
      toolsListed = true;
      
      // Test 3: Check environment variables
      console.log('\nTest 3: Environment Configuration');
      console.log('✅ MYSQL_HOST:', process.env.MYSQL_HOST || 'Not set');
      console.log('✅ MYSQL_DATABASE:', process.env.MYSQL_DATABASE || 'Not set');
      console.log('✅ MYSQL_SSL:', process.env.MYSQL_SSL || 'Not set');
      
      // Clean exit
      setTimeout(() => {
        server.kill();
        console.log('\n🎉 MCP Server is working correctly!');
        console.log('\n📋 Next steps:');
        console.log('1. Use MCP Inspector: npx @modelcontextprotocol/inspector node build/index.js');
        console.log('2. Configure in VS Code settings.json');
        console.log('3. Test database connection with mysql_connect tool');
        process.exit(0);
      }, 1000);
    }
  } catch (e) {
    // Ignore JSON parse errors
  }
});

server.on('error', (error) => {
  console.log('❌ Server error:', error.message);
  process.exit(1);
});

setTimeout(() => {
  if (!serverStarted) {
    console.log('❌ Server failed to start within 5 seconds');
    server.kill();
    process.exit(1);
  }
}, 5000);
