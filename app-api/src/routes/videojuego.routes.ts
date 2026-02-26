import { Router } from "express";
import * as VideojuegoCtrl from "../controllers/videojuego.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", authMiddleware, asyncHandler(VideojuegoCtrl.videojuegoGetAll));
router.get("/:id", authMiddleware, asyncHandler(VideojuegoCtrl.videojuegoGetById));
router.post("/", authMiddleware, adminMiddleware, asyncHandler(VideojuegoCtrl.videojuegoCreate));
router.put("/:id", authMiddleware, adminMiddleware, asyncHandler(VideojuegoCtrl.videojuegoUpdate));
router.delete("/:id", authMiddleware, adminMiddleware, asyncHandler(VideojuegoCtrl.videojuegoDelete));

export default router;
