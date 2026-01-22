const { Schema, model } = require('mongoose');

const VideoGameSchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String },
  developer: { type: String },
  releaseDate: { type: Date },
  platforms: [{ type: String }],
  rating: { type: Number, min: 0, max: 10 },
  multiplayer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('VideoGame', VideoGameSchema);
