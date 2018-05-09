import Store from './store'

export default class Transaction {
  constructor(db, stores, mode = 'readwrite') {
    this.transaction = db.transaction(stores, mode)
  }

  collection(name) {
    return new Store(this.db, this.transaction.objectStore(name))
  }
}