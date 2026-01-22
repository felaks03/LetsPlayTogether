const { Schema, model } = require('mongoose');

const VideojuegoSchema = new Schema({
  titulo: { type: String, required: true },
  genero: { type: String },
  desarrollador: { type: String },
  fechaLanzamiento: { type: Date },
  plataformas: [{ type: String }],
  puntuacion: { type: Number, min: 0, max: 10 },
  multijugador: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now },
});

module.exports = model('Videojuego', VideojuegoSchema);
