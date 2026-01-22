import { Router } from "express";
import mercancia from "./mercancia.routes";

const router = Router();

router.use("/mercancias", mercancia);

export default router;
