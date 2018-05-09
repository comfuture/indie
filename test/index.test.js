const indie = require('../lib/indie')

test('indie should returns promise', () => {
  expect(indie('test_db') instanceof Promise)
})
