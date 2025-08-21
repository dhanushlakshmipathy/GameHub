const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Game = require("../models/Game");
const auth = require("../middleware/auth");

// ================== Create a review (Protected) ==================
router.post("/", auth, async (req, res) => {
  try {
    const { gameId, rating, comment } = req.body;

    if (!gameId || !rating) {
      return res.status(400).json({ message: "Game ID and rating are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: "Game not found" });

    const review = new Review({
      game: gameId,
      user: req.user.id,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Create Review Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Get all reviews for a game ==================
router.get("/game/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const reviews = await Review.find({ game: gameId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get Reviews Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// ================== Get average rating for a game ==================
router.get("/average/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid Game ID" });
    }

    const reviews = await Review.find({ game: gameId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.json({ gameId, averageRating: avgRating.toFixed(1), totalReviews: reviews.length });
  } catch (err) {
    console.error("Average Rating Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
// ================== Update a review (Protected) ==================
router.put("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only the review owner can update
    if (review.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();
    res.json(review);
  } catch (err) {
    console.error("Update Review Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});
// ================== Delete a review (Protected) ==================
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Only the review owner can delete
    if (review.user.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await review.remove();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Delete Review Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});




// Feed: reviews from followed users
router.get("/feed", auth, async (req, res) => {
  try {
    const User = require("../models/Users");
    const me = await User.findById(req.user.id);
    const followingIds = me?.following || [];
    if (!followingIds.length) return res.json([]);

    const Review = require("../models/Review");
    const items = await Review.find({ user: { $in: followingIds } })
      .populate("user", "username")
      .populate("game", "title genre platform")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
