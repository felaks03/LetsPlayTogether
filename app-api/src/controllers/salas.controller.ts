import { Request, Response } from "express";
import * as SalaService from "../services/salas.service";
import { ISala } from "../models/salas.model";
import { Types } from "mongoose";

/**
 * Tipos para los params y body de cada endpoint
 */
interface SalaIdParam {
  id: string;
}

interface SalaUserBody {
  salaId: string;
  userId: string;
}

interface SalaEstadoBody {
  salaId: string;
  estado: "OPEN" | "IN_GAME" | "FULL" | "CLOSED";
}

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
    if (!Types.ObjectId.isValid(id)) return res.status(400).json({ error: "ID de sala inválido" });

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
    if (!data.nombre || !data.videojuego || !data.host) {
      return res.status(400).json({ error: "Datos incompletos para crear sala" });
    }

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
    const sala = await SalaService.leaveSala(salaId, userId);
    res.json(sala);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}


/**
 * Actualizar estado de sala
 */
export async function updateEstadoSalaController(
  req: Request<{}, {}, SalaEstadoBody>,
  res: Response
) {
  try {
    const { salaId, estado } = req.body;

    // VALIDAMOS que no se intente enviar FULL manualmente
    if (estado === "FULL") {
      return res.status(400).json({ error: "No se puede poner FULL manualmente" });
    }

    const sala = await SalaService.updateEstadoSala(salaId, estado);
    res.json(sala);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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
