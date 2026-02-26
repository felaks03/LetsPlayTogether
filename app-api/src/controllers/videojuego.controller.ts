import { Request, Response, NextFunction } from "express";
import * as VideojuegoService from "../services/videojuego.service";
import { AppError } from "../middleware/AppError";

export async function videojuegoGetAll(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await VideojuegoService.videojuegoList();
    res.json(items);
  } catch (err: any) {
    next(err);
  }
}

export async function videojuegoGetById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const item = await VideojuegoService.videojuegoGetById(id);
    if (!item) return next(new AppError(404, "No encontrado"));
    res.json(item);
  } catch (err: any) {
    next(err);
  }
}

export async function videojuegoCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const saved = await VideojuegoService.videojuegoCreate(req.body);
    res.status(201).json(saved);
  } catch (err: any) {
    next(err);
  }
}

export async function videojuegoUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const updated = await VideojuegoService.videojuegoUpdate(id, req.body);
    if (!updated) return next(new AppError(404, "No encontrado"));
    res.json(updated);
  } catch (err: any) {
    next(err);
  }
}

export async function videojuegoDelete(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    const removed = await VideojuegoService.videojuegoDelete(id);
    if (!removed) return next(new AppError(404, "No encontrado"));
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
}
