import Store from './store'
import Transaction from './transaction'

export function isSupported() {
  if (typeof window === 'undefined') {
    return false
  }
  let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  return indexDB !== null
}

export function open(name, version = 1) {
  if (!isSupported()) {
    throw new Error('indexDB is not supported')
  }
  return new Promise((resolve, reject) => {
    let req = window.indexedDB.open(name, version)
    req.onerror = event => {
      reject(`indexDB open error: ${event.target.errorCode}`)
    }
    req.onupgradeneeded = event => {
      // TODO: implement this
    }
    req.onsuccess = event => {
      resolve(event.target.result)
    }
  })
}

export default class DB extends Promise {
  constructor(name, version = 1) {
    super((resolve, reject) => {
      // before
      return open(name, version).then(idb => {
        this.idb = idb
        resolve(this)
      })
    })    
  }

  // then(onFulfilled, onRejected) {
  //   return super.then(onFulfilled, onRejected)
  // }

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