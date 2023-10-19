// FSO part 3

// initializing
const express = require("express");
var morgan = require("morgan");
const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.static("dist"));

// parser here ( needed for post )
// change the body to json
app.use(express.json());

// token to extract body from the post request
morgan.token("request-body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body); // Assuming the request body is JSON
  } else {
    return "";
  }
});

// logger here morgan for the log details
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :request-body"
  )
);

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
const PORT = process.env.PORT || 3001;
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

  console.log(request.body);

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
