const express = require("express");
const persons = require("./persons.json");

const app = express();

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

app.listen(3001, () => {
  console.log("Starting server on port 3001");
});
