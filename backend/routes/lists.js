const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Game = require("../models/Game");
const router = express.Router();

// Helper to ensure valid list name
const valid = new Set(["wishlist", "nowPlaying", "completed", "backlog"]);

router.get("/", auth, async (req, res) => {
  const me = await User.findById(req.user.id).populate([
    { path: "lists.wishlist", select: "title coverUrl avgRating" },
    { path: "lists.nowPlaying", select: "title coverUrl avgRating" },
    { path: "lists.completed", select: "title coverUrl avgRating" },
    { path: "lists.backlog", select: "title coverUrl avgRating" }
  ]);
  res.json(me.lists);
});

router.post("/:list/:gameId", auth, async (req, res) => {
  const { list, gameId } = req.params;
  if(!valid.has(list)) return res.status(400).json({ message: "Invalid list" });
  const game = await Game.findById(gameId);
  if(!game) return res.status(404).json({ message: "Game not found" });
  const me = await User.findById(req.user.id);
  const arr = me.lists[list];
  if(!arr.map(String).includes(gameId)) arr.push(gameId);
  await me.save();
  res.json({ message: "Added", lists: me.lists });
});

router.delete("/:list/:gameId", auth, async (req, res) => {
  const { list, gameId } = req.params;
  if(!valid.has(list)) return res.status(400).json({ message: "Invalid list" });
  const me = await User.findById(req.user.id);
  me.lists[list] = me.lists[list].filter(id => String(id) != String(gameId));
  await me.save();
  res.json({ message: "Removed", lists: me.lists });
});

module.exports = router;