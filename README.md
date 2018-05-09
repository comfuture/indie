# indie

An indexDB wrapper that follows contemporary es6 styles.  
aka. **in**dex**DB** **i**n **e**s6

![travis ci](https://travis-ci.org/comfuture/indie)

## Installation

```
npm i indie
```

## Concept

### initialize

just call function `indie` with parameter `dbname` and `version`

```
import indie from 'indie'

let db = await indie('band', 1)
```

Yes. `indie` returns `Promise`. so you can code it in classic style:

```
indie('band', 1).then(db => {
  let cursor = db.collection('members').find({role: 'guitar'})
  for (let member of cursor) {
    console.log(member.name)
  }
})
```

### create scheme

if upgrade is needed caused by version change, scheme will re-defined

```
let customer = db.Scheme('customer', {
  id: {
    type: String,
    primary: true
  }
  email: [db.EmailType, Unique('email')],
  name: [String, Index('name')],
  age: Integer
}
```

or just use pre defined store.  
`db.collection(name)` will returns `Store` instance that is wrapper of `IDBStore`.

```
let customer = db.collection('customer')

customer.get(key)
customer.add({...})
customer.delete(key)
```

### transaction

Open transaction direct from `Store`

```
customer.transaction('rw', store => {
  store.add({...})
})
```

or make composite transaction by pass collection names to `db.transaction`

```
db.transaction(['customer', 'reservation'], 'rw', ([customer, reservation]) => {
  customer...
})

// or

db.transaction([customer, reservation], 'rw', () => {
  customer.add(...)
  reservation.delete(key)
})
```

### query

You can use index rather than using keyPath on getting entry

```
customer.findOne({name: 'Donna'})
// or
customer.get({name: 'Donna'})
```



```
customer.find({age: {$gte: 75}})  // iterator (generator)

customer.find({age: {$gte: 75}}).keys()  // key iterator (generator)
```


## Develop

```
git clone https://github.com/comfuture/indie.git
npm i
npm run test
```