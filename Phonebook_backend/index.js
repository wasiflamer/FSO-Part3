// importing mondb stuff
require('dotenv').config()
const Entry = require('./models/entry')

// FSO part 3 backened

// initializing
const express = require('express')
var morgan = require('morgan')

const app = express()

// parser here ( needed for post )
// change the body to json
app.use(express.json())
// kinda importing the frontend build here
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())

// token to extract body from the post request
morgan.token('request-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body) // Assuming the request body is JSON
  } else {
    return ''
  }
})

// logger here morgan for the log details
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :request-body'
  )
)

// defining error handler
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

// DATA
let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

// opening a port to listen to
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// main route
app.get('/', (request, response) => {
  response.send('go to api/persons to get data ')
})

//  ALL phonebook entries route
app.get('/api/persons', (request, response) => {
  Entry.find({}).then((entries) => {
    response.json(entries)
  })
})

// info about phonebook entries route
app.get('/info', (request, response) => {
  // calculate time here
  const currentTime = new Date()

  Entry.find({}).then((entries) => {
    response.send(`<P>Phonebook has info for ${entries.length} people</P>
    <p>${currentTime}</p>
  `)
  })
})

// single entry route
app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then((entry) => {
      if (entry) {
        response.json(entry)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// delete entry route
// app.delete("/api/persons/:id", (request, response) => {

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// const id = Number(request.params.id);
// data = data.filter((data) => data.id !== id);
// response.status(204).end();
// });

// add entry route
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // console.log(request.body);

  // if (!body.name) {
  //   return response.status(400).json({
  //     error: "name missing",
  //   });
  // }

  // if (!body.number) {
  //   return response.status(400).json({
  //     error: "number missing",
  //   });
  // }

  // let result = data.find((data) => data.name === body.name);

  // // name already exits
  // if (result) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  // console.log("it was here ! ");

  const entry = new Entry({
    name: body.name,
    number: body.number,
  })

  entry
    .save()
    .then((savedentry) => {
      data = data.concat(savedentry)
      response.json(savedentry)
    })
    .catch((error) => next(error))
})

// update route
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const entry = {
    name: body.name,
    number: body.number,
  }

  Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
    .then((updatedentry) => {
      response.json(updatedentry)
    })
    .catch((error) => next(error))
})
