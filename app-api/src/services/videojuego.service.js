const Videojuego = require("../models/videojuego.model");

async function videojuegoList() {
  return Videojuego.find().lean();
}

async function videojuegoGetById(id) {
  return Videojuego.findById(id).lean();
}

async function videojuegoCreate(data) {
  const m = new Videojuego(data);
  return m.save();
}

async function videojuegoUpdate(id, data) {
  return Videojuego.findByIdAndUpdate(id, data, { new: true }).lean();
}

async function videojuegoDelete(id) {
  return Videojuego.findByIdAndDelete(id).lean();
}

module.exports = {
  videojuegoList,
  videojuegoGetById,
  videojuegoCreate,
  videojuegoUpdate,
  videojuegoDelete,
};
