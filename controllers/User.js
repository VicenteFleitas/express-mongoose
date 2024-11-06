const Jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/User");

const { JWT_SECRET, JWT_EXPIRES } = require("../config");

const validate = (name, email, password) => {
  let errors = [];
  if (name === undefined || name.trim() === "") {
    errors.push("name its empty.");
  }
  if (email === undefined || email.trim() === "") {
    errors.push("email its empty.");
  }
  if (password === undefined || password.trim() === "") {
    errors.push("password its empty.");
  }
  return errors;
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    var validation = validate(name, email, password);
    if (validation.length === 0) {
      let pass = await bcryptjs.hash(password, 8);
      const newUser = new User({ name: name, email: email, password: pass });
      await newUser.save();
      return res.status(200).json({ msg: "User successfully created." });
    } else {
      console.log("error: ", validation);
      return res.status(400).json({ msg: validation });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Unable to create User." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validate("name", email, password);
    if (validation.length === 0) {
      let info = await User.findOne({ email: email });
      if (!info || !(await bcryptjs.compare(password, info.password))) {
        return res
          .status(404)
          .json({ status: false, errors: ["User doesn't exists."] });
      }
      const token = Jwt.sign({ id: info._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES,
      });
      const user = {
        id: info._id,
        name: info.name,
        email: info.email,
        token: token,
      };
      return res
        .status(200)
        .json({ status: true, data: user, msg: "Successfully authenticated." });
    } else {
      return res.status(400).json({ status: false, msg: validation });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: error });
  }
};

module.exports = { login, createUser };
