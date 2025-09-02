// Test authentication flow
const api = require('./utils/api.js')

async function testAuth() {
  try {
    // Test registration
    console.log('Testing registration...')
    const registerRes = await api.register('test@example.com', '123456', 'Test User')
    console.log('Registration successful:', registerRes)
    
    // Test login
    console.log('Testing login...')
    const loginRes = await api.login('test@example.com', '123456')
    console.log('Login successful:', loginRes)
    
    // Test get user info
    console.log('Testing get user info...')
    const userInfo = await api.getUserInfo()
    console.log('User info:', userInfo)
    
    console.log('All tests passed!')
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testAuth()