const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required."],
    minLength: 3,
    maxLength: 20,
    trim: true,
    validate: {
      validator: (value) => {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(value);
      },
      message: "First name must container only alphabetic characters.",
    },
  },
  lastName: {
    type: String,
    required: [true, "Last name is required."],
  },
  emailAddress: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  age: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Contact", contactSchema);
