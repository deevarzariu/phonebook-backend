const express = require("express");
const morgan = require("morgan");
const persons = require("./persons.json");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ message: "Person not found!" });
  }

  return res.json(person);
});

app.post("/api/persons", (req, res) => {
  const { body } = req;

  if (!body.name) {
    return res.status(400).json({ message: "Person has no name!" });
  }
  if (!body.number) {
    return res.status(400).json({ message: "Person has no phone number!" });
  }

  const person = persons.find((p) => p.name === body.name);
  if (person) {
    return res.status(400).json({
      message: `${body.name} is already registered in this phonebook`,
    });
  }

  const id = Math.floor(Math.random() * 1000).toString();
  persons.push({ id, ...body });
  return res.status(201).json({ message: "New person created!" });
});

app.delete("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const person = persons.find((p) => p.id === id);

  if (!person) {
    return res.status(404).json({ message: "Person not found!" });
  }

  const index = persons.indexOf(person);
  persons.splice(index, 1);
  return res.status(200).json({ message: "Person removed" });
});

app.listen(3001, () => {
  console.log("Starting server on port 3001");
});
