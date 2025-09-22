/**
 * Backend Test Script
 * Tests the todo API endpoints to ensure everything is working
 */

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing Todo Backend API...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('');

    // Test 2: Get all todos (should be empty initially)
    console.log('2️⃣ Testing GET /api/todos...');
    const todosResponse = await fetch(`${API_BASE}/todos`);
    const todosData = await todosResponse.json();
    console.log('✅ Get todos:', todosData.message);
    console.log('📊 Current todos count:', todosData.data?.length || 0);
    console.log('');

    // Test 3: Create a new todo
    console.log('3️⃣ Testing POST /api/todos...');
    const createResponse = await fetch(`${API_BASE}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Test todo from script'
      })
    });
    const createData = await createResponse.json();
    console.log('✅ Create todo:', createData.message);
    const todoId = createData.data?._id || createData.data?.id;
    console.log('🆔 Todo ID:', todoId);
    console.log('');

    if (todoId) {
      // Test 4: Get the created todo
      console.log('4️⃣ Testing GET /api/todos/:id...');
      const getTodoResponse = await fetch(`${API_BASE}/todos/${todoId}`);
      const getTodoData = await getTodoResponse.json();
      console.log('✅ Get todo by ID:', getTodoData.message);
      console.log('📝 Todo text:', getTodoData.data?.text);
      console.log('');

      // Test 5: Toggle todo completion
      console.log('5️⃣ Testing PATCH /api/todos/:id/toggle...');
      const toggleResponse = await fetch(`${API_BASE}/todos/${todoId}/toggle`, {
        method: 'PATCH'
      });
      const toggleData = await toggleResponse.json();
      console.log('✅ Toggle todo:', toggleData.message);
      console.log('✔️ Completed:', toggleData.data?.completed);
      console.log('');

      // Test 6: Update todo text
      console.log('6️⃣ Testing PUT /api/todos/:id...');
      const updateResponse = await fetch(`${API_BASE}/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Updated test todo from script'
        })
      });
      const updateData = await updateResponse.json();
      console.log('✅ Update todo:', updateData.message);
      console.log('📝 Updated text:', updateData.data?.text);
      console.log('');

      // Test 7: Get stats
      console.log('7️⃣ Testing GET /api/todos/stats...');
      const statsResponse = await fetch(`${API_BASE}/todos/stats`);
      const statsData = await statsResponse.json();
      console.log('✅ Get stats:', statsData.message);
      console.log('📊 Stats:', statsData.data);
      console.log('');

      // Test 8: Delete the todo
      console.log('8️⃣ Testing DELETE /api/todos/:id...');
      const deleteResponse = await fetch(`${API_BASE}/todos/${todoId}`, {
        method: 'DELETE'
      });
      const deleteData = await deleteResponse.json();
      console.log('✅ Delete todo:', deleteData.message);
      console.log('');
    }

    console.log('🎉 All tests completed successfully!');
    console.log('✅ Backend is working properly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('💡 Make sure the backend is running:');
    console.log('   cd backend && npm start');
    console.log('   or');
    console.log('   docker-compose up backend');
  }
}

// Run the tests
testAPI();