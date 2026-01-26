const mongoose = require('mongoose');
const { Schema } = mongoose;

const VideoGameSchema = new Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  platform: { type: String },
  releaseDate: { type: Date },
  developer: { type: String },
  publisher: { type: String },
  rating: { type: Number, min: 0, max: 10 },
  price: { type: Number, min: 0 },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('VideoGame', VideoGameSchema);
