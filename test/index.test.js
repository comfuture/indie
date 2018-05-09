const indie = require('../src/index')

test('indie should returns promise', () => {
  expect(indie('test_db') instanceof Promise)
})
