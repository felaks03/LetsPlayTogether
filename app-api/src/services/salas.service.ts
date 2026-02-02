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
    estado: "OPEN", // Siempre inicia abierta
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
  if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("IDs inválidos");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

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

  // Actualizar estado automáticamente si llega al máximo
  if (sala.usuarios.length >= sala.maxUsuarios) {
    sala.estado = "FULL";
  }

  await sala.save();
  return sala;
}

/**
 * Salir de una sala
 */
export async function leaveSala(salaId: string, userId: string) {
  if (!Types.ObjectId.isValid(salaId) || !Types.ObjectId.isValid(userId)) {
    throw new Error("IDs inválidos");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

  const userObjectId = new Types.ObjectId(userId);

  sala.usuarios = sala.usuarios.filter(u => !u.equals(userObjectId));

  // Recalcular estado si la sala no está cerrada
  if (sala.estado !== "CLOSED") {
    sala.estado = sala.usuarios.length >= sala.maxUsuarios ? "FULL" : "OPEN";
  }

  await sala.save();
  return sala;
}

/**
 * Actualizar el estado de una sala
 * Solo se permite OPEN, IN_GAME o CLOSED manualmente
 * FULL solo se maneja automáticamente
 */
export async function updateEstadoSala(
  salaId: string,
  estado: "OPEN" | "IN_GAME" | "CLOSED"
) {
  if (!Types.ObjectId.isValid(salaId)) {
    throw new Error("ID inválido");
  }

  const sala = await Sala.findById(salaId);
  if (!sala) throw new Error("Sala no encontrada");

  // FULL ya no se puede poner manualmente
  sala.estado = estado;
  await sala.save();
  return sala;
}

/**
 * Eliminar una sala
 */
export async function deleteSala(salaId: string) {
  if (!Types.ObjectId.isValid(salaId)) return null;
  return Sala.findByIdAndDelete(salaId).lean();
}
