// const indie = require('../lib/indie')
import indie from '../src/index'

test('indie should returns promise', () => {
  expect(indie('test_db') instanceof Promise)
})
