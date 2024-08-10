const express = require("express");
const persons = require("./persons.json");

const app = express();

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.listen(3001, () => {
  console.log("Starting server on port 3001");
});
