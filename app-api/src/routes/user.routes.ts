import { Router } from "express";
import {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    addAmigoController,
    removeAmigoController,
} from "../controllers/user.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";

const router = Router();

router.post("/", createUserController);
router.get("/", authMiddleware, getUsersController);
router.get("/:id", authMiddleware, getUserByIdController);
router.put("/:id", authMiddleware, updateUserController);
router.delete("/:id", authMiddleware, deleteUserController);
router.post("/:id/amigos", authMiddleware, addAmigoController);
router.delete("/:id/amigos/:friendId", authMiddleware, removeAmigoController);

export default router;
