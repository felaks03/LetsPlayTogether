import { Router } from "express";
import * as VideojuegoCtrl from "../controllers/videojuego.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";

const router = Router();

// GET públicas (sin autenticación)
router.get("/", VideojuegoCtrl.videojuegoGetAll);
router.get("/:id", VideojuegoCtrl.videojuegoGetById);

// POST, PUT, DELETE protegidas (requieren auth + admin)
router.post("/", authMiddleware, adminMiddleware, VideojuegoCtrl.videojuegoCreate);
router.put("/:id", authMiddleware, adminMiddleware, VideojuegoCtrl.videojuegoUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, VideojuegoCtrl.videojuegoDelete);

export default router;
