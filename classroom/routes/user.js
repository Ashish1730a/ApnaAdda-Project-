const express = require("express");
const router = express.Router();

// Index – GET all users
router.get("/", (req, res) => {
  res.send("GET for users");
});

// Show – GET a specific user by ID
router.get("/:id", (req, res) => {
  res.send("GET for user id");
});

// Create – POST a new user
router.post("/users", (req, res) => {
  res.send("POST for users");
});

// Delete – DELETE a user by ID
router.delete("/:id", (req, res) => {
  res.send("DELETE for user id");
});



module.exports = router;