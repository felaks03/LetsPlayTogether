import { Router } from "express";
import * as SalaController from "../controllers/salas.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", authMiddleware, asyncHandler(SalaController.getSalas));
router.post("/", authMiddleware, asyncHandler(SalaController.createSala));
router.post("/join", authMiddleware, asyncHandler(SalaController.joinSala));
router.post("/leave", authMiddleware, asyncHandler(SalaController.leaveSala));
router.patch("/estado", authMiddleware, asyncHandler(SalaController.updateEstadoSalaController));
router.get("/:id", authMiddleware, asyncHandler(SalaController.getSalaById));
router.delete("/:id", authMiddleware, asyncHandler(SalaController.deleteSala));

export default router;