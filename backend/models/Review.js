const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
