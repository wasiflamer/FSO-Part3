// importing mondb stuff
require("dotenv").config();
const Entry = require("./models/entry");

// FSO part 3 backened ..

// initializing
const express = require("express");
var morgan = require("morgan");

const app = express();

// kinda importing the frontend build here
app.use(express.static("build"));
const cors = require("cors");
app.use(cors());

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
  Entry.find({}).then((entries) => {
    response.json(entries);
  });
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
  Entry.findById(request.params.id).then((entry) => {
    response.json(entry);
  });
});

// delete entry route
// app.delete("/api/persons/:id", (request, response) => {

app.delete("/api/persons/:id", (request, response, next) => {
  Entry.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// const id = Number(request.params.id);
// data = data.filter((data) => data.id !== id);
// response.status(204).end();
// });

const generateId = () => {
  const maxId = data.length > 0 ? Math.max(...data.map((n) => n.id)) : 0;
  return maxId + 1;
};

// add entry route
app.post("/api/persons", (request, response) => {
  const body = request.body;

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
  });

  entry.save().then((savedentry) => {
    data = data.concat(savedentry);
    response.json(savedentry);
  });
});
