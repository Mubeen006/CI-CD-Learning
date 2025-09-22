#!/usr/bin/env node

/**
 * Development Startup Script
 * Starts the backend and frontend in development mode
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Todo App in Development Mode...\n');

// Start backend
console.log('📦 Starting Backend Server...');
const backend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit for backend to start, then start frontend
// Poll backend /health endpoint and only start frontend when backend is ready
const http = require('http');

function waitForBackend(url, timeoutMs = 30000, intervalMs = 500) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        // Consider any 2xx/3xx as healthy
        if (res.statusCode >= 200 && res.statusCode < 400) {
          res.resume(); // consume data
          return resolve();
        }
        res.resume();
        if (Date.now() - start > timeoutMs) return reject(new Error('Timeout waiting for backend'));
        setTimeout(attempt, intervalMs);
      });

      req.on('error', () => {
        // backend not ready yet
        if (Date.now() - start > timeoutMs) return reject(new Error('Timeout waiting for backend'));
        setTimeout(attempt, intervalMs);
      });
    };

    attempt();
  });
}

(async () => {
  try {
    console.log('\n🔄 Waiting for backend to be ready at http://localhost:5000/health ...');
    await waitForBackend('http://localhost:5000/health', 30000, 500);

    console.log('\n🎨 Starting Frontend Development Server...');
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true
    });

    frontend.on('close', (code) => {
      console.log(`\n🎨 Frontend process exited with code ${code}`);
      backend.kill();
    });
  } catch (err) {
    console.error('❌ Backend did not become ready in time:', err.message);
    console.log('⚠️ Starting frontend anyway...');
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true
    });

    frontend.on('close', (code) => {
      console.log(`\n🎨 Frontend process exited with code ${code}`);
      backend.kill();
    });
  }
})();

backend.on('close', (code) => {
  console.log(`\n📦 Backend process exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  process.exit(0);
});

console.log('\n📝 Todo App will be available at:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend:  http://localhost:5000');
console.log('\n💡 Press Ctrl+C to stop both servers');