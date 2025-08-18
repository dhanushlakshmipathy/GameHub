const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

// Test route - create sample user
router.get("/create-test", async (req, res) => {
  try {
    const newUser = new Users({ username: "TestUser" });
    await newUser.save();
    res.json({ message: "User saved to MongoDB ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET one user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update user by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await Users.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
