/**
 * Health Check Script
 * Verifies that all services are running correctly
 */

async function checkHealth() {
  console.log("🏥 Running Health Checks...\n");

  const checks = [
    {
      name: "Backend Server",
      url: "http://localhost:5000/health",
      expected: "Server is running",
    },
    {
      name: "Backend API",
      url: "http://localhost:5000/api/todos",
      expected: "success",
    },
    {
      name: "Frontend Server",
      url: "http://localhost:5173",
      expected: "html",
    },
  ];

  for (const check of checks) {
    try {
      console.log(`🔍 Checking ${check.name}...`);

      const response = await fetch(check.url);
      const isHealthy = response.ok;

      if (isHealthy) {
        console.log(`✅ ${check.name}: Healthy`);
      } else {
        console.log(`❌ ${check.name}: Unhealthy (Status: ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${check.name}: Not responding (${error.message})`);
    }
    console.log("");
  }

  console.log("🎯 Health check completed!");
  console.log("\n💡 If any service is unhealthy:");
  console.log("   1. Make sure MongoDB is running");
  console.log("   2. Start backend: cd backend && npm start");
  console.log("   3. Start frontend: cd frontend && npm run dev");
  console.log("   4. Or use Docker: docker-compose up");
}

checkHealth().catch(console.error);
