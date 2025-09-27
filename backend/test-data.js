const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Test user registration
async function createTestUser() {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Test Athlete',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: '2000-01-01',
      gender: 'male',
      height: 175,
      weight: 70,
      location: {
        state: 'Maharashtra',
        district: 'Mumbai',
        pincode: '400001'
      },
      phoneNumber: '9876543210',
      sportsInterests: ['Cricket', 'Football']
    });
    
    console.log('User created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.response?.data || error.message);
  }
}

// Test health endpoint
async function testHealth() {
  try {
    const response = await axios.get('http://localhost:3001/health');
    console.log('Health check:', response.data);
  } catch (error) {
    console.error('Health check failed:', error.message);
  }
}

async function runTests() {
  console.log('Testing AthletIQ API...\n');
  
  await testHealth();
  await createTestUser();
  
  console.log('\nCheck MongoDB Compass now - you should see the athletiq database with users collection!');
}

runTests();