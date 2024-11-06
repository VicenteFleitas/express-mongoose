const Jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User");

const { JWT_SECRET, JWT_EXPIRES } = require("../config");

const validate = (name, email, password) => {
  let errors = [];
  if (name === undefined || name.trim() === "") {
    errors.push("Name its empty.");
  }
  if (email === undefined || email.trim() === "") {
    errors.push("Email its empty.");
  }
  if (password === undefined || password.trim() === "") {
    errors.push("Password its empty.");
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    var validation = validate(name, email, password);
    if (validation === "") {
      let pass = await bcryptjs.hash(password, 8);
      const newUser = new User({ name: name, email: email, password: pass });
      await newUser.save();
      return res.status(200).json({ msg: "User successfully created." });
    } else {
      return res.status(400).json({ msg: validation });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to create User." });
  }
};

module.exports = createUser;
