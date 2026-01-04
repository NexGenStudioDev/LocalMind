// set all required env vars before importing modules that parse process.env
process.env.PORT = process.env.PORT || '5000'
process.env.HOST = process.env.HOST || 'localhost'
process.env.APP_ENV = process.env.APP_ENV || 'test'
process.env.DEBUG = 'true'
process.env.Your_Name = 'test'
process.env.YOUR_EMAIL = 'test@example.com'
process.env.YOUR_PASSWORD = 'password'
process.env.LOG_LEVEL = 'debug'
process.env.GROQ_API_KEY = 'x'
process.env.CORS_ENABLED = 'true'
process.env.RATE_LIMIT_ENABLED = 'false'
process.env.ENABLE_RATE_LIMITING = 'false'
process.env.JWT_SECRET = 'x'.repeat(40) // strong secret for tests
process.env.JWT_EXPIRATION = '7d'
process.env.DB_HOST = 'localhost'
process.env.DB_PORT = '27017'
process.env.DB_NAME = 'testdb'
process.env.DB_USER = 'user'
process.env.DB_PASSWORD = 'pass'
process.env.DB_CONNECTION_STRING = 'mongodb://localhost:27017/test'
process.env.REDIS_HOST = 'localhost'
process.env.REDIS_PORT = '6379'
process.env.REDIS_PASSWORD = ''
process.env.UPLOAD_DIR = '/tmp'
process.env.TEMP_DIR = '/tmp'
process.env.MAX_FILE_SIZE = '100000'
process.env.ENCRYPTION_KEY = 'enc'
process.env.SERVER_HMAC_SECRET = 'x'.repeat(48) // strong HMAC for tests
process.env.BACKEND_URL = 'http://localhost:5000'

import UserUtils from '../user.utils'

describe('UserUtils token helpers', () => {
  test('generateToken and verifyToken roundtrip', () => {
    const payload = { _id: 'abc123', email: 'a@b.com', role: 'user' }
    const token = UserUtils.generateToken(payload)
    const decoded = UserUtils.verifyToken(token)
    expect(decoded).not.toBeNull()
    expect(decoded?.email).toEqual(payload.email)
    expect(decoded?._id).toEqual(payload._id)
    expect(decoded?.role).toEqual(payload.role)
  })

  test('verifyToken returns null for invalid token', () => {
    const decoded = UserUtils.verifyToken('invalid.token')
    expect(decoded).toBeNull()
  })
})
