import { Request, Response, NextFunction } from "express";
import * as SalaService from "../services/salas.service";
import { Types } from "mongoose";
import { AppError } from "../middleware/AppError";

interface SalaUserBody {
  salaId: string;
  userId: string;
}

interface SalaEstadoBody {
  salaId: string;
  estado: "OPEN" | "IN_GAME" | "FULL" | "CLOSED";
}

interface SalaKickBody {
  salaId: string;
  userId: string;
}

interface SalaCreateBody {
  nombre: string;
  videojuego: string;
  host: string;
  maxUsuarios?: number;
  expiraEn?: Date;
}

export async function getSalas(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const salas = await SalaService.getSalas();
    res.json(salas);
  } catch (err: any) {
    next(err);
  }
}

export async function getSalaById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return next(new AppError(400, "ID de sala inválido"));
    }
    const sala = await SalaService.getSalaById(id);
    if (!sala) return next(new AppError(404, "Sala no encontrada"));
    res.json(sala);
  } catch (err: any) {
    next(err);
  }
}

export async function createSala(
  req: Request<{}, {}, SalaCreateBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body;
    if (!data.nombre || !data.videojuego || !data.host) {
      return next(new AppError(400, "Datos incompletos para crear sala"));
    }
    const nuevaSala = await SalaService.createSala({
      ...data,
      videojuego: new Types.ObjectId(data.videojuego),
      host: new Types.ObjectId(data.host),
    });
    res.status(201).json(nuevaSala);
  } catch (err: any) {
    next(err);
  }
}

export async function joinSala(
  req: Request<{}, {}, SalaUserBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salaId, userId } = req.body;
    const sala = await SalaService.joinSala(salaId, userId);
    res.json(sala);
  } catch (err: any) {
    next(new AppError(400, err.message));
  }
}

export async function leaveSala(
  req: Request<{}, {}, SalaUserBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salaId, userId } = req.body;
    const sala = await SalaService.leaveSala(salaId, userId);
    res.json(sala);
  } catch (err: any) {
    next(new AppError(400, err.message));
  }
}

export async function kickUsuario(
  req: Request<{}, {}, SalaKickBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const hostId = (req as Request & { user?: { id: string } }).user?.id;
    if (!hostId || !Types.ObjectId.isValid(hostId)) {
      return next(new AppError(401, "Sesión no válida"));
    }
    const { salaId, userId } = req.body;
    if (!salaId || !Types.ObjectId.isValid(salaId)) {
      return next(new AppError(400, "salaId inválido"));
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return next(new AppError(400, "userId inválido"));
    }
    const sala = await SalaService.kickUsuarioFromSala(salaId, hostId, userId);
    res.json(sala);
  } catch (err: any) {
    next(new AppError(400, err.message));
  }
}

export async function updateEstadoSalaController(
  req: Request<{}, {}, SalaEstadoBody>,
  res: Response,
  next: NextFunction
) {
  try {
    const { salaId, estado } = req.body;
    if (estado === "FULL") {
      return next(new AppError(400, "No se puede poner FULL manualmente"));
    }
    const sala = await SalaService.updateEstadoSala(salaId, estado);
    res.json(sala);
  } catch (err: any) {
    next(new AppError(400, err.message));
  }
}

export async function deleteSala(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id as string;
    if (!Types.ObjectId.isValid(id)) {
      return next(new AppError(400, "ID inválido"));
    }
    const sala = await SalaService.deleteSala(id);
    if (!sala) return next(new AppError(404, "Sala no encontrada"));
    res.status(204).send();
  } catch (err: any) {
    next(err);
  }
}
