import { Router } from "express";
import * as controller from "../controllers/mercancia.controller";

const router = Router();

router.get("/", controller.listar);
router.post("/", controller.crear);

export default router;
