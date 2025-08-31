const http = require('http');

const data = JSON.stringify({
  title: 'Test Consultation',
  content: 'This is a test consultation',
  category: 'general',
  priority: 'normal',
  guest_name: 'Test User',
  guest_email: 'test@example.com'
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/consultations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', responseData);
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();