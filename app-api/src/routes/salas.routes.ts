import { Router } from "express";
import * as SalaController from "../controllers/salas.controller";

const router = Router();

/**
 * Rutas para Salas
 */

// Obtener todas las salas
router.get("/", SalaController.getSalas);

// Obtener sala por ID
router.get("/:id", SalaController.getSalaById);

// Crear sala
router.post("/", SalaController.createSala);

// Unirse a una sala
router.post("/join", SalaController.joinSala);

// Salir de una sala
router.post("/leave", SalaController.leaveSala);

// Actualizar estado de sala
router.patch("/estado", SalaController.updateEstadoSala);

// Eliminar sala
router.delete("/:id", SalaController.deleteSala);

export default router;
