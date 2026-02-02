import { Router } from "express";
import videojuegosRouter from "./videojuego.routes";
import salasRouter from "./salas.routes";

const router = Router();

router.use("/videojuegos", videojuegosRouter);
router.use("/salas", salasRouter);

export default router;
