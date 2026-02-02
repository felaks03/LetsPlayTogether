import { Router } from "express";
import * as SalaController from "../controllers/salas.controller";

const router = Router();

/**
 * Rutas para Salas
 */

// Obtener todas las salas
router.get("/", SalaController.getSalas);

// Crear sala
router.post("/", SalaController.createSala);

// Acciones
router.post("/join", SalaController.joinSala);
router.post("/leave", SalaController.leaveSala);
router.patch("/estado", SalaController.updateEstadoSala);

// Obtener / eliminar por ID (SIEMPRE al final)
router.get("/:id", SalaController.getSalaById);
router.delete("/:id", SalaController.deleteSala);

export default router;