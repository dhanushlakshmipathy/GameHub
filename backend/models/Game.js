const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    genre: { type: String },
    platform: { type: String },
    releaseDate: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

// Virtual field for average rating
gameSchema.virtual("averageRating", {
  ref: "Review",
  localField: "_id",
  foreignField: "game",
  justOne: false,
});

// Optional: toJSON to include virtuals
gameSchema.set("toJSON", { virtuals: true });
gameSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Game", gameSchema);
