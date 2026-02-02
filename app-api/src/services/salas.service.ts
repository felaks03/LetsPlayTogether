import Sala, { ISala } from "../models/salas.model";
import { Types } from "mongoose";

/**
 * Crear una sala
 */

interface CreateSalaData {
  nombre: string;
  videojuego: Types.ObjectId;
  host: Types.ObjectId;
  maxUsuarios?: number;
  expiraEn?: Date;
}

export async function createSala(data: CreateSalaData) {
  const sala = new Sala({
    ...data,
    usuarios: [data.host],
  });

  return sala.save();
}


/**
 * Obtener todas las salas
 */
export async function getSalas() {
  return Sala.find().lean();
}

/**
 * Obtener una sala por ID
 */
export async function getSalaById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return Sala.findById(id).lean();
}

/**
 * Unirse a una sala
 */
export async function joinSala(salaId: string, userId: string) {
  // Validación de IDs
  if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
    return null;
  }

  const sala = await Sala.findById(salaId);
  if (!sala) return null;

  // No permitir unirse si la sala está cerrada
  if (sala.estado === "CLOSED") {
    throw new Error("La sala está cerrada");
  }

  const userObjectId = new Types.ObjectId(userId);

  // Evitar duplicados
  if (sala.usuarios.some(u => u.equals(userObjectId))) {
    return sala;
  }

  // Verificar límite de usuarios
  if (sala.usuarios.length >= sala.maxUsuarios) {
    sala.estado = "FULL";
    await sala.save();
    throw new Error("La sala está llena");
  }

  // Añadir usuario
  sala.usuarios.push(userObjectId);

  // Actualizar estado según cantidad
  if (sala.usuarios.length === sala.maxUsuarios) {
    sala.estado = "FULL";
  } else if (sala.estado === "OPEN") {
    sala.estado = "IN_GAME";
  }

  return sala.save();
}

/**
 * Salir de una sala
 */
export async function leaveSala(salaId: string, userId: string) {
  if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
    return null;
  }

  return Sala.findByIdAndUpdate(
    salaId,
    { $pull: { usuarios: new Types.ObjectId(userId) } },
    { new: true }
  ).lean();
}

/**
 * Actualizar el estado de una sala
 */
export async function updateEstadoSala(salaId: string, estado: ISala["estado"]) {
  if (!Types.ObjectId.isValid(salaId)) return null;

  return Sala.findByIdAndUpdate(
    salaId,
    { estado },
    { new: true }
  ).lean();
}

/**
 * Eliminar una sala
 */
export async function deleteSala(salaId: string) {
  if (!Types.ObjectId.isValid(salaId)) return null;
  return Sala.findByIdAndDelete(salaId).lean();
}
