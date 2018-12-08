const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms')
)

// let persons = [
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": 1
//   },
//   {
//     "name": "Martti Tienari",
//     "number": "040-123456",
//     "id": 2
//   },
//   {
//     "name": "Arto Järvinen",
//     "number": "040-123456",
//     "id": 3
//   },
//   {
//     "name": "Lea Kutvonen",
//     "number": "040-123456",
//     "id": 4
//   }
// ]

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

// const generateId = () => {
//   const maxId = persons.length > 0 ? persons.map(n => n.id).sort((a, b) => a - b).reverse()[0] : 1
//   return maxId + 1
// }

//
// -------- routes:
//

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
    })
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(`puhelinluettelossa on ${persons.length} henkilön tiedot. ${new Date()}`)
    })
    .catch(error => response(404).send({ error: 'couldn\'t fetch info' }))

})

app.get('/api/persons/:id', (request, response) => {
  // const id = Number(request.params.id)
  // const note = persons.find(n => n.id === id)
  // if (note) {
  //   response.json(note)
  // } else {
  //   response.status(404).end()
  // }

  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (request, response) => {
  // persons = persons.filter(p => p.id !== id)
  // response.status(204).end()

  Person
    .findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => response.status(400).send({ error: 'malformatted id' }))

})

app.post('/api/persons', (request, response) => {
  const body = (request.body)
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'person or number missing' })
  }
  // if (persons.find(p => p.name === body.name)) {
  //   return response.status(400).json({ error: 'person already exists' })
  // }

  Person
    .findOne({ name: body.name })
    .then(result => {
      if (result) {
        response.status(409).end()
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })

        person
          .save()
          .then(savedPerson => {
            response.json(formatPerson(savedPerson))
          })
      }
    })
    // .then((result) => {
    //   const person = new Person({
    //     name: body.name,
    //     number: body.number
    //   })

    //   person
    //     .save()
    //     .then(savedPerson => {
    //       response.json(formatPerson(savedPerson))
    //     })
    // })
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }
  console.log(person)

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => response.json(formatPerson(updatedPerson)))
    .catch(error => response.status(400).send({ error: 'malformatted id' }))
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(error)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
