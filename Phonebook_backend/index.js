// FSO part 3

// initializing
const express = require("express");
const app = express();

// needed for post
app.use(express.json());

// DATA
let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// opening a port to listen to
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// main route
app.get("/", (request, response) => {
  response.send("go to api/persons to get data ");
});

//  ALL phonebook entries route
app.get("/api/persons", (request, response) => {
  response.json(data);
});

// info about phonebook entries route
app.get("/info", (request, response) => {
  // calculate time here
  const currentTime = new Date();

  response.send(`<P>Phonebook has info for ${data.length} people</P>
  <p>${currentTime}</p>
  `);
});

// single entry route
app.get("/api/persons/:id", (request, response) => {
  // get the parameter with request.params
  const id = Number(request.params.id);
  const note = data.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// delete entry route
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((data) => data.id !== id);
  response.status(204).end();
});

const generateId = () => {
  const maxId = data.length > 0 ? Math.max(...data.map((n) => n.id)) : 0;
  return maxId + 1;
};

// add entry route
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  let result = data.find((data) => data.name === body.name);

  // name already exits
  if (result) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  data = data.concat(person);

  response.json(data);
});
