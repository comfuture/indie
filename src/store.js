import Cursor from './cursor'

export function build(db, name, scheme) {
  let pk = find_primary_key_from_scheme()
  let indices = find_indices_from_scheme()
  let store = db.createObject(name, {keyPath: pk})
  for (let ix of indices) {
    store.createIndex(ix.key, ix.name, ix.options)
  }
  return store
}

export const IDBKeyRange = function() {
  let global = window || {}
  global.IDBKeyRange || global.webkitIDBKeyRange || global.msIDBKeyRange || {
    only(key) {},
    lowerBound(key, exclusive = false) {},
    upperBound(key, exclusive = false) {},
    bound(upper, lower, upperExclusive, lowerExclusive) {}
  }
}()

export class Criteria {
  constructor(store, criteria) {
    this.criteria = criteria
    // Case 1. criteria = {name: 'Donna'}
    this.index = store.index(Object.keys(criteria)[0])
    // Case 2. criteria = {age: {$gte: 18, $lt: 65}}
  }

  get() {
    return new Promise((resolve, reject) => {
      let req = this.index.get(Object.values(this.criteria)[0])
      req.onsuccess(event => {
        resolve(event.target.result)
      })
      req.onerror(event => {
        reject(event.target.errorCode)
      })
    })
  }

  *cursor() {
    yield* new Cursor(this.index)
  }

  *keys() {
    yield* new Cursor(this.index, true)
  }
}

export default class Store {

  constructor(db, name, scheme = null) {
    this.db = db
    this.name = name
    if (scheme !== null) {
      this.store = build(db, name, scheme)
    } else {
      this.store = db.transaction([name], 'readwrite')
        .objectStore(name)
    }
  }

  add(entry) {
    return this.store.add(entry)
  }

  get(key) {
    return new Promise((resolve, reject) => {
      let req = this.store.get(key)
      req.onsuccess = event => {
        resolve(event.target.result)
      }
      req.onerror = event => {
        reject(event.target.errorCode)
      }
    })
  }

  findOne(criteria) {
    let filter = new Criteria(criteria)
    return filter.get()
  }

  find(criteria) {
    let filter = new Criteria(criteria)
    return filter.cursor()
  }

  keys(criteria) {
    let filter = new Criteria(criteria)
    return filter.keys()
  }

  update(key, newValues) {

  }

  delete(key) {
    return new Promise((resolve, reject) => {
      let req = this.db.transaction([this.name], 'readwrite')
        .objectStore(this.name)
        .delete(key)
      req.onsuccess = resolve
    })
  }
}