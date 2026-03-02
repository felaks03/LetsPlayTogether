import { Router } from "express";
import * as VideojuegoCtrl from "../controllers/videojuego.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";

const router = Router();

//Auth desactivada temporalmente para realizar frontend salas
router.get("/", VideojuegoCtrl.videojuegoGetAll);
router.get("/:id", VideojuegoCtrl.videojuegoGetById);
router.post("/", VideojuegoCtrl.videojuegoCreate);
router.put("/:id", VideojuegoCtrl.videojuegoUpdate);
router.delete("/:id", VideojuegoCtrl.videojuegoDelete);


export default router;
