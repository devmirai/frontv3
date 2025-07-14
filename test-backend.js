// Test script to verify backend connectivity
// You can run this in the browser console to test the connection

async function testBackendConnection() {
  const API_BASE = 'http://localhost:8081';
  
  console.log('🚀 Testing backend connection...');
  
  try {
    // Test 1: Check if backend is accessible
    console.log('📡 Testing backend availability...');
    const healthResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      })
    });
    
    console.log(`✅ Backend is accessible. Status: ${healthResponse.status}`);
    
    if (healthResponse.status === 401) {
      console.log('✅ Authentication endpoint working (returned 401 for invalid credentials)');
    }
    
    // Test 2: Try to create a test user
    console.log('👤 Testing user creation...');
    const testUserData = {
      email: 'test@example.com',
      nombre: 'Test',
      apellidoPaterno: 'User',
      apellidoMaterno: 'Demo',
      password: 'password123',
      rol: 'USUARIO'
    };
    
    const createResponse = await fetch(`${API_BASE}/api/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData)
    });
    
    if (createResponse.ok) {
      console.log('✅ User creation endpoint working');
      
      // Test 3: Try to login with the created user
      console.log('🔐 Testing login with created user...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUserData.email,
          password: testUserData.password
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful!', loginData);
      } else {
        console.log('❌ Login failed:', await loginResponse.text());
      }
    } else {
      const errorText = await createResponse.text();
      console.log('❌ User creation failed:', errorText);
      
      if (createResponse.status === 409) {
        console.log('ℹ️ User might already exist, trying to login...');
        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testUserData.email,
            password: testUserData.password
          })
        });
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('✅ Login successful with existing user!', loginData);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    console.log('ℹ️ Make sure your backend server is running on port 8081');
    console.log('ℹ️ The frontend will fall back to mock data for testing');
  }
}

// Run the test
console.log('='.repeat(50));
console.log('🧪 mirAI Backend Connection Test');
console.log('='.repeat(50));
testBackendConnection();
