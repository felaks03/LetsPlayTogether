import { Router } from "express";
import { registerController, loginController } from "./auth.controller";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/register", asyncHandler(registerController));
router.post("/login", asyncHandler(loginController));

export default router;
