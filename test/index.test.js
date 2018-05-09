global.window = global
const { IDBFactory, IDBDatabase, IDBKeyRange, reset } = require('shelving-mock-indexeddb')
global.indexedDB = new IDBFactory()
global.IDBKeyRange = IDBKeyRange

import indie from '../src/index'

beforeEach(() => window.indexedDB.deleteDatabase('test'))

test('indie should returns promise', () => {
  expect(indie('test') instanceof Promise)
})

test('DB::idb should instanceof IDBDatabase', async () => {
  let db = await indie('test')
  expect(db.idb instanceof IDBDatabase)
})
