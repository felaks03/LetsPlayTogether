import { Request, Response } from "express";
import * as SalaService from "../services/salas.service";
import { ISala } from "../models/salas.model";
import { Types } from "mongoose";

/**
 * Tipos para los params y body de cada endpoint
 */

// Para rutas que reciben :id
interface SalaIdParam {
  id: string;
}

// Para join y leave de sala
interface SalaUserBody {
  salaId: string;
  userId: string;
}

// Para actualizar estado
interface SalaEstadoBody {
  salaId: string;
  estado: "OPEN" | "IN_GAME" | "FULL" | "CLOSED";
}

// Para crear sala
interface SalaCreateBody {
  nombre: string;
  videojuego: string;
  host: string;
  maxUsuarios?: number;
  expiraEn?: Date;
}

/**
 * Obtener todas las salas
 */
export async function getSalas(req: Request, res: Response) {
  try {
    const salas: ISala[] = await SalaService.getSalas();
    res.json(salas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener las salas" });
  }
}

/**
 * Obtener sala por ID
 */
export async function getSalaById(req: Request<SalaIdParam>, res: Response) {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID de sala inválido" });
    }

    const sala = await SalaService.getSalaById(id);
    if (!sala) return res.status(404).json({ error: "Sala no encontrada" });

    res.json(sala);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener la sala" });
  }
}

/**
 * Crear sala
 */
export async function createSala(req: Request<{}, {}, SalaCreateBody>, res: Response) {
  try {
    const data = req.body;

    // Validaciones mínimas
    if (!data.nombre || !data.videojuego || !data.host) {
      return res.status(400).json({ error: "Datos incompletos para crear sala" });
    }

    // Convertimos los IDs que vienen como string en ObjectId de Mongoose
    const nuevaSala = await SalaService.createSala({
      ...data,
      videojuego: new Types.ObjectId(data.videojuego),
      host: new Types.ObjectId(data.host),
    });

    res.status(201).json(nuevaSala);
  } catch (err) {
    res.status(500).json({ error: "Error al crear la sala" });
  }
}


/**
 * Unirse a una sala
 */
export async function joinSala(req: Request<{}, {}, SalaUserBody>, res: Response) {
  try {
    const { salaId, userId } = req.body;

    if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const sala = await SalaService.joinSala(salaId, userId);
    res.json(sala);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Salir de una sala
 */
export async function leaveSala(req: Request<{}, {}, SalaUserBody>, res: Response) {
  try {
    const { salaId, userId } = req.body;

    if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "IDs inválidos" });
    }

    const sala = await SalaService.leaveSala(salaId, userId);
    res.json(sala);
  } catch (err) {
    res.status(500).json({ error: "Error al salir de la sala" });
  }
}

/**
 * Actualizar estado de sala
 */
export async function updateEstadoSala(req: Request<{}, {}, SalaEstadoBody>, res: Response) {
  try {
    const { salaId, estado } = req.body;

    if (!Types.ObjectId.isValid(salaId)) {
      return res.status(400).json({ error: "ID de sala inválido" });
    }

    const sala = await SalaService.updateEstadoSala(salaId, estado);
    if (!sala) return res.status(404).json({ error: "Sala no encontrada" });

    res.json(sala);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el estado de la sala" });
  }
}

/**
 * Eliminar sala
 */
export async function deleteSala(req: Request<SalaIdParam>, res: Response) {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "ID inválido" });

    const sala = await SalaService.deleteSala(id);
    if (!sala) return res.status(404).json({ error: "Sala no encontrada" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar la sala" });
  }
}
