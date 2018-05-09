/**
 * returns promise that will be resolved when condition become true
 * 
 * @param {Function} condition 
 * @returns {Promise}
 */
async function waitUntil(condition) {
  let cooldown = () => new Promise(resolve => setTimeout(resolve, 1))
  while (true) {
    if (condition()) {
      resolve()
    }
    await cooldown()
  }
}

export default class Cursor {
  /**
   * indexDB cursor iterator wrapper
   * 
   * @param {IDBCursor | IDBIndex} index 
   * @param {Boolean} keyOnly 
   */
  constructor(index, keyOnly = false) {
    let cursorFactory = ['openCursor', 'openKeyCursor'][Number(keyOnly)]
    let cursorRequest = index[cursorFactory]()
    this.cursorReady = false
    cursorRequest.onsuccess = event => {
      this.cursor = event.target.result
      this.cursorReady = true
    }
  }

  toArray() {
    return new Promise((resolve, reject) => resolve([...this]))
  }

  async *[Symbol.iterator]() {
    await waitUntil(() => this.cursorReady)
    while (this.cursor) {
      yield this.cursor.value
      this.cursor.continue()
    }
  }
}