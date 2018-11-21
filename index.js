const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token('body', (req, res) => { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms')
)

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

const generateId = () => {
  const maxId = persons.length > 0 ? persons.map(n => n.id).sort((a, b) => a - b).reverse()[0] : 1
  return maxId + 1
}




app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/info', (request, response) => {
  response.send(`puhelinluettelossa on ${persons.length} henkilön tiedot. ${new Date()}`)
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = persons.find(n => n.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})
app.post('/api/persons', (request, response) => {
  const body = (request.body)
  console.log(body)
  console.log(persons)

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'person or number missing' })
  }
  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: 'person already exists' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
