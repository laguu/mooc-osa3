const mongoose = require('mongoose')
const Schema = mongoose.Schema

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://seppo:taalasmaa1@ds115854.mlab.com:15854/puhelinluettelo'
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