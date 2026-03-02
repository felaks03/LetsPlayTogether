import { Router } from "express";
import * as SalaController from "../controllers/salas.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", asyncHandler(SalaController.getSalas));
router.post("/", asyncHandler(SalaController.createSala));
router.post("/join", asyncHandler(SalaController.joinSala));
router.post("/leave", asyncHandler(SalaController.leaveSala));
router.patch("/estado", asyncHandler(SalaController.updateEstadoSalaController));
router.get("/:id", asyncHandler(SalaController.getSalaById));
router.delete("/:id", asyncHandler(SalaController.deleteSala));

export default router;