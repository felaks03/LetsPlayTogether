const Videojuego = require("../models/videojuego.model");

async function videojuegoGetAll(req, res) {
  const items = await Videojuego.find().lean();
  res.json(items);
}

async function videojuegoGetById(req, res) {
  const { id } = req.params;
  const item = await Videojuego.findById(id).lean();
  if (!item) return res.status(404).json({ error: "No encontrado" });
  res.json(item);
}

async function videojuegoCreate(req, res) {
  const nuevo = new Videojuego(req.body);
  const saved = await nuevo.save();
  res.status(201).json(saved);
}

async function videojuegoUpdate(req, res) {
  const { id } = req.params;
  const updated = await Videojuego.findByIdAndUpdate(id, req.body, {
    new: true,
  }).lean();
  if (!updated) return res.status(404).json({ error: "No encontrado" });
  res.json(updated);
}

async function videojuegoDelete(req, res) {
  const { id } = req.params;
  const removed = await Videojuego.findByIdAndDelete(id).lean();
  if (!removed) return res.status(404).json({ error: "No encontrado" });
  res.status(204).send();
}

module.exports = {
  videojuegoGetAll,
  videojuegoGetById,
  videojuegoCreate,
  videojuegoUpdate,
  videojuegoDelete,
};