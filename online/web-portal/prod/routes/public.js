const express = require("express");


const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.redirect("/users/login");
});


module.exports = router;

