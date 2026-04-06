import { Router } from "express";
import {
    createUserController,
    getUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
    addAmigoController,
    removeAmigoController,
    toggleFavoritoController,
    uploadAvatarController,
} from "../controllers/user.controller";
import { authMiddleware, adminMiddleware } from "../auth/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { uploadAvatarMiddleware } from "../middleware/uploadAvatar";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, asyncHandler(createUserController));
router.get("/", authMiddleware, asyncHandler(getUsersController));

router.post(
    "/:id/favoritos/:videojuegoId",
    authMiddleware,
    asyncHandler(toggleFavoritoController)
);
router.post(
    "/:id/avatar",
    authMiddleware,
    uploadAvatarMiddleware.single("foto"),
    asyncHandler(uploadAvatarController)
);
router.post("/:id/amigos", authMiddleware, asyncHandler(addAmigoController));
router.delete(
    "/:id/amigos/:friendId",
    authMiddleware,
    asyncHandler(removeAmigoController)
);

router.get("/:id", authMiddleware, asyncHandler(getUserByIdController));
router.put("/:id", authMiddleware, asyncHandler(updateUserController));
router.delete("/:id", authMiddleware, asyncHandler(deleteUserController));

export default router;
