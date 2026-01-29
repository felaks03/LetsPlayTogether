import { Router } from "express";
import videojuegosRouter from "./videojuego.routes";
import userRouter from "./user.routes";
import authRouter from "../auth/auth.routes";

const router = Router();

router.use("/videojuegos", videojuegosRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
