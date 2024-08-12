require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.get("/info", (req, res) => {
  Person.countDocuments().then((nbPeople) => {
    res.send(`
      <p>Phonebook has info for ${nbPeople} people</p>
      <p>${new Date()}</p>
    `);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const { id } = req.params;

  Person.findOne({ _id: id }).then((person) => {
    res.json(person);
  });
});

app.post("/api/persons", (req, res) => {
  const {
    body: { name, number },
  } = req;

  if (!name) {
    return res.status(400).json({ message: "Person has no name!" });
  }
  if (!number) {
    return res.status(400).json({ message: "Person has no phone number!" });
  }

  Person.findOne({ name }).then((person) => {
    if (person) {
      return res.status(400).json({
        message: `${name} is already registered in this phonebook`,
      });
    }

    const newPerson = new Person({ name, number });
    newPerson.save().then(() => {
      return res.status(201).json(newPerson);
    });
  });
});

app.put("/api/persons/:id", (req, res) => {
  const { id } = req.params;
  const {
    body: { name, number },
  } = req;

  if (!name) {
    return res.status(400).json({ message: "Person has no name!" });
  }
  if (!number) {
    return res.status(400).json({ message: "Person has no phone number!" });
  }

  Person.findByIdAndUpdate(id, { name, number }, { new: true })
    .then((person) => {
      return res.status(201).json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;

  Person.findByIdAndDelete(id)
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => next(error));
});

app.use((error, req, res, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "Incorrect id format" });
  }

  next(error);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Starting server on port ${PORT}`);
});
