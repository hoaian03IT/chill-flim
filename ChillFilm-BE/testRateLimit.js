const axios = require('axios');

async function testRateLimit() {
  const url = 'http://localhost:3000/v1/auth/login'; 
  const totalRequests = 20;
  const delay = 200;

  for (let i = 1; i <= totalRequests; i++) {
    try {
      const response = await axios.post(url, {
        username: 'huy',
        password: '111111',
      });

      console.log(`Request ${i}:`, response.data);
    } catch (error) {
      if (error.response) {
        console.log(`Request ${i}:`, error.response.data);
      } else {
        console.log(`Request ${i}: Lỗi không xác định`);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

testRateLimit();
