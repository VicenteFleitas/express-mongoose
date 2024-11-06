const express = require("express");
const router = express.Router();
const user = require("../controllers/User");

router.post("/user", user.createUser);
router.post("/login", user.login);

module.exports = router;
