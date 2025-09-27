const axios = require('axios');

async function testSignup() {
    try {
        const userData = {
            name: "Test User",
            email: "testuser@example.com",
            password: "password123"
        };

        console.log('Sending data:', JSON.stringify(userData, null, 2));

        const response = await axios.post('http://localhost:3001/api/auth/register', userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Success:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testSignup();