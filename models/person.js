const mongoose = require('mongoose')
const Schema = mongoose.Schema

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI


mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// const formatPerson = (person) => {
//   return {
//     name: note.name,
//     number: note.number,
//     id: note._id
//   }
// }


// personSchema.statics.format = function (person, cb) { // ??????
//   return cb({
//     name: person.name,
//     number: person.number,
//     id: person._id
//   })
// };

module.exports = Person