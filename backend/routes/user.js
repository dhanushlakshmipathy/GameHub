const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

// Get current user profile
router.get("/me", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select("-password").populate("following", "username");
    if (!me) return res.status(404).json({ message: "User not found" });
    res.json(me);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Follow a user
router.post("/:id/follow", auth, async (req, res) => {
  try {
    const targetId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(targetId)) return res.status(400).json({ message: "Invalid user id" });
    if (targetId === req.user.id) return res.status(400).json({ message: "You cannot follow yourself" });

    const me = await User.findById(req.user.id);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    if (me.following.map(x=>x.toString()).includes(targetId)) return res.status(200).json({ message: "Already following" });

    me.following.push(targetId);
    target.followers.push(me._id);
    await me.save();
    await target.save();

    res.json({ message: "Followed", following: me.following });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Unfollow a user
router.delete("/:id/follow", auth, async (req, res) => {
  try {
    const targetId = req.params.id;
    const me = await User.findById(req.user.id);
    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    me.following = me.following.filter(u => u.toString() !== targetId);
    target.followers = target.followers.filter(u => u.toString() !== me._id.toString());
    await me.save();
    await target.save();

    res.json({ message: "Unfollowed", following: me.following });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// List users (public)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("username createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
