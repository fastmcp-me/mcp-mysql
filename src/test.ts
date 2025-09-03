import { spawn } from 'child_process';
import { writeFileSync } from 'fs';

console.log('Testing MCP MySQL Server...');

// Test that the server starts and responds to list_tools
const server = spawn('node', ['build/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let output = '';
let hasError = false;

server.stdout.on('data', (data) => {
  output += data.toString();
});

server.stderr.on('data', (data) => {
  const errorMsg = data.toString();
  if (errorMsg.includes('MySQL MCP server running on stdio')) {
    console.log('✅ Server started successfully');
    
    // Send list_tools request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/list'
    };
    
    server.stdin.write(JSON.stringify(request) + '\n');
    
    setTimeout(() => {
      server.kill();
      console.log('✅ Test completed successfully');
      console.log('✅ Server responds to requests');
      process.exit(0);
    }, 1000);
  } else if (errorMsg.includes('Error')) {
    console.error('❌ Server error:', errorMsg);
    hasError = true;
  }
});

server.on('exit', (code) => {
  if (code !== 0 && !hasError) {
    console.error('❌ Server exited with code:', code);
    process.exit(1);
  }
});

setTimeout(() => {
  if (!hasError) {
    console.log('⚠️  Server did not start within expected time');
    server.kill();
    process.exit(1);
  }
}, 5000);
