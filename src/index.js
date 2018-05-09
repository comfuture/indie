import DB from './db'

export default function indie(name, version = 1) {
  let db = new DB(name, version)
  return db.open()
}

export const Index = (name) => ({name, unique: false})
export const Unique = (name) => ({name, unique: true})

export * from './db'
export * from './store'
export * from './transaction'
export * from './types'


/*
let db = await indie('crm', 1)
let customer = db.Store('customer', {
  // define scheme
  id: {
    type: String,
    primary: true
  }
  email: [db.EmailType, db.Unique],
  name: [String, db.Index('name')],
  age: Integer
}

// or

let customer = db.collection('customer')

customer.get(key)
customer.add({...})
customer.delete(key)

customer.transaction('rw', store => {
  store.add({...})
})

db.transaction(['customer', 'reservation'], 'rw', ([customer, reservation]) => {
  customer...
})

// or

db.transaction([customer, reservation], 'rw', () => {
  customer.add(...)
  reservation.delete(key)
})

customer.findOne({name: 'Donna'})
customer.find({age: {$gte: 75}})  // iterator (generator)

customer.find({age: {$gte: 75}}).keys()  // key iterator (generator)
*/