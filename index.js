const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const Contact = require("./routes/Contact"); // 1

app.use("/api", Contact);

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/mydatabase", {
      autoIndex: true,
    });
    console.log("Connected to MongoDb.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectToDB();

const port = 3000;
app.listen(port, () => {
  console.log("Server started successfully!");
});
