const sum = require('./sum')
const createTestConn = require('./createTestConn')

beforeAll(() => {
  createTestConn()
})

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
