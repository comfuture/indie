import Store from './store'
import Transaction from './transaction'

export const indexedDB = function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
}()

export function isSupported() {
  if (typeof window === 'undefined') {
    return false
  }
  return indexedDB !== null
}

export default class DB {
  constructor(name, version = 1) {
    this.name = name
    this.version = version
  }

  open() {
    if (!isSupported()) {
      throw new Error('indexDB is not supported')
    }
    return new Promise((resolve, reject) => {
      let req = window.indexedDB.open(this.name, this.version)
      req.onerror = event => {
        reject(`indexDB open error: ${event.target.errorCode}`)
      }
      req.onupgradeneeded = event => {
        this.idb = event.target.result
        // TODO: implement this
        resolve(this)
      }
      req.onsuccess = event => {
        this.idb = event.target.result
        resolve(this)
      }
    })
  }

  Scheme(name, scheme) {
    // create store with scheme
    return new Store(this.idb, name, scheme)
  }

  transaction(stores, mode = 'readwrite') {
    return new Transaction(this.idb, [name], mode)
  }

  collection(name, mode = 'readwrite') {
    // returns store wrapper
    return this.transaction([name], mode).collection(name)
  }
}