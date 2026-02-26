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
import { authMiddleware } from "../auth/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post("/", asyncHandler(createUserController));
router.get("/", authMiddleware, asyncHandler(getUsersController));
router.get("/:id", authMiddleware, asyncHandler(getUserByIdController));
router.put("/:id", authMiddleware, asyncHandler(updateUserController));
router.delete("/:id", authMiddleware, asyncHandler(deleteUserController));
router.post("/:id/amigos", authMiddleware, asyncHandler(addAmigoController));
router.delete("/:id/amigos/:friendId", authMiddleware, asyncHandler(removeAmigoController));

export default router;
