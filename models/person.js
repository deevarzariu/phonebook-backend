const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name must be at least 3 characters long!"],
    required: [true, "Name required!"],
  },
  number: {
    type: String,
    minLength: [8, "Phone number must be at least 8 characters long!"],
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "Phone number required!"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

module.exports = Person;
