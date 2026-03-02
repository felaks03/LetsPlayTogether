import { Request, Response } from "express";
import * as VideojuegoService from "../services/videojuego.service";

export async function videojuegoGetAll(req: Request, res: Response) {
  console.log("[videojuegoGetAll] Obteniendo todos los videojuegos");
  const items = await VideojuegoService.videojuegoList();
  console.log("[videojuegoGetAll] Videojuegos obtenidos:", items.length);
  res.json(items);
}

export async function videojuegoGetById(req: Request, res: Response) {
  const id = req.params.id as string;
  console.log("[videojuegoGetById] Obteniendo videojuego con ID:", id);
  const item = await VideojuegoService.videojuegoGetById(id);
  if (!item) {
    console.log("[videojuegoGetById] Videojuego no encontrado para ID:", id);
    return res.status(404).json({ error: "No encontrado" });
  }
  console.log("[videojuegoGetById] Videojuego encontrado:", item);
  res.json(item);
}

export async function videojuegoCreate(req: Request, res: Response) {
  const saved = await VideojuegoService.videojuegoCreate(req.body);
  res.status(201).json(saved);
}

export async function videojuegoUpdate(req: Request, res: Response) {
  const id = req.params.id as string;
  const updated = await VideojuegoService.videojuegoUpdate(id, req.body);
  if (!updated) return res.status(404).json({ error: "No encontrado" });
  res.json(updated);
}

export async function videojuegoDelete(req: Request, res: Response) {
  const id = req.params.id as string;
  const removed = await VideojuegoService.videojuegoDelete(id);
  if (!removed) return res.status(404).json({ error: "No encontrado" });
  res.status(204).send();
}
