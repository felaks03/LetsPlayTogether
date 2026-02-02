import { Router } from "express";
import * as VideojuegoCtrl from "../controllers/videojuego.controller";

const router = Router();

router.get("/", VideojuegoCtrl.videojuegoGetAll);
router.get("/:id", VideojuegoCtrl.videojuegoGetById);
router.post("/", VideojuegoCtrl.videojuegoCreate);
router.put("/:id", VideojuegoCtrl.videojuegoUpdate);
router.delete("/:id", VideojuegoCtrl.videojuegoDelete);

export default router;
