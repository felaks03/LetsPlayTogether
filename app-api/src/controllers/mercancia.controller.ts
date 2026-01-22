import { Request, Response } from "express";
import { Mercancia } from "../models/mercancia.model";

export const listar = async (_req: Request, res: Response) => {
  const items = await Mercancia.find().lean();
  res.json(items);
};

export const crear = async (req: Request, res: Response) => {
  const m = new Mercancia(req.body);
  const saved = await m.save();
  res.status(201).json(saved);
};
