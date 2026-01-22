import { Request, Response } from 'express';

const Videojuego = require('../models/videojuego.model');

export const listar = async (_req: Request, res: Response) => {
  const items = await Videojuego.find().lean();
  res.json(items);
};

export const obtenerPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await Videojuego.findById(id).lean();
  if (!item) return res.status(404).json({ error: 'No encontrado' });
  res.json(item);
};

export const crear = async (req: Request, res: Response) => {
  const nuevo = new Videojuego(req.body);
  const saved = await nuevo.save();
  res.status(201).json(saved);
};

export const actualizar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await Videojuego.findByIdAndUpdate(id, req.body, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: 'No encontrado' });
  res.json(updated);
};

export const eliminar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const removed = await Videojuego.findByIdAndDelete(id).lean();
  if (!removed) return res.status(404).json({ error: 'No encontrado' });
  res.status(204).send();
};
