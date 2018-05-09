import Store from './store'
import Transaction from './transaction'

const IDBFactory = function() {
  return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
}

export function isSupported() {
  if (typeof window === 'undefined') {
    return false
  }
  return IDBFactory() !== null
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
    const indexedDB = IDBFactory()
    return new Promise((resolve, reject) => {
      let req = indexedDB.open(this.name, this.version)
      req.onerror = event => {
        reject(`indexDB open error: ${event.target.errorCode}`)
      }
      req.onupgradeneeded = event => {
        this.idb = event.target.result
        // TODO: implement this
        console.log('`DB`:: upgrade needed')
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