import DB from './db'

export default function indie(name, version = 1) {
  let db = new DB(name, version)
  return db.open()
}

export * from './db'
export * from './store'
export * from './transaction'
export * from './types'
export * from './scheme'
