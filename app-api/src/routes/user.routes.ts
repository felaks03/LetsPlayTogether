import { Router } from "express";
import {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} from "../controllers/user.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";

const router = Router();

router.post("/", createUserController);
router.get("/:id", authMiddleware, getUserByIdController);
router.put("/:id", authMiddleware, updateUserController);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUserController);
router.get("/", authMiddleware, getUsersController);

export default router;
