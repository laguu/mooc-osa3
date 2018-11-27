const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://seppo:taalasmaa1@ds115854.mlab.com:15854/puhelinluettelo'

// print process.argv
// process.argv.forEach((val, index) => {
//   console.log(`${index}: ${val}`);
// });

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv[2] && process.argv[3]) {

  console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save() // tallentaa tietokantaan, palauttaa promisen
    .then(response => {
      console.log('note saved!')
      mongoose.connection.close()
    })
} else {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}