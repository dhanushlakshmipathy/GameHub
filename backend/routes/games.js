const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Game = require("../models/Game");
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// ================== Create a new game (Protected) ==================
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, genre, platform, releaseDate } = req.body;
    if (!title || !genre) return res.status(400).json({ message: "Title and Genre required" });

    const game = new Game({
      title,
      description,
      genre,
      platform,
      releaseDate,
      createdBy: req.user.id,
    });

    await game.save();
    res.status(201).json(game);
  } catch (err) {
    console.error("Create Game Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Get all games ==================
router.get("/", async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    console.error("Get Games Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Get one game by ID with average rating ==================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid Game ID" });

    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const reviews = await Review.find({ game: id });
    const avgRating =
      reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.json({ ...game.toObject(), averageRating: avgRating.toFixed(1) });
  } catch (err) {
    console.error("Get Game Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Trending games by review count ==================
router.get("/trending/review-count", async (req, res) => {
  try {
    const trending = await Game.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "game",
          as: "reviews",
        },
      },
      {
        $addFields: { reviewCount: { $size: "$reviews" } },
      },
      { $sort: { reviewCount: -1, createdAt: -1 } },
      { $limit: 5 },
    ]);

    res.json(trending);
  } catch (err) {
    console.error("Trending by Review Count Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Trending games by average rating ==================
router.get("/trending/average-rating", async (req, res) => {
  try {
    const trending = await Game.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "game",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
          reviewCount: { $size: "$reviews" },
        },
      },
      { $sort: { averageRating: -1, reviewCount: -1, createdAt: -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          genre: 1,
          platform: 1,
          averageRating: { $ifNull: ["$averageRating", 0] },
          reviewCount: 1,
        },
      },
    ]);

    res.json(trending);
  } catch (err) {
    console.error("Trending by Avg Rating Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Search games by title or genre ==================
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });

    const games = await Game.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { genre: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    res.json(games);
  } catch (err) {
    console.error("Search Games Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
