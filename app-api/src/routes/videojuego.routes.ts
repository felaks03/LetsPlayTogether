import { Router } from "express";
import * as VideojuegoCtrl from "../controllers/videojuego.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/", authMiddleware, VideojuegoCtrl.videojuegoGetAll);
router.get("/:id", authMiddleware, VideojuegoCtrl.videojuegoGetById);
router.post("/", authMiddleware, adminMiddleware, VideojuegoCtrl.videojuegoCreate);
router.put("/:id",authMiddleware,  adminMiddleware, VideojuegoCtrl.videojuegoUpdate);
router.delete("/:id", authMiddleware, adminMiddleware, VideojuegoCtrl.videojuegoDelete);

export default router;
