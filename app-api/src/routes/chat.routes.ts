import { Router } from "express";
import {
    getChatsController,
    getChatByIdController,
    getOrCreateChatController,
    createMensajeController,
} from "../controllers/chat.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get("/", authMiddleware, asyncHandler(getChatsController));
router.get("/:id", authMiddleware, asyncHandler(getChatByIdController));
router.post("/", authMiddleware, asyncHandler(getOrCreateChatController));
router.post("/:id/mensajes", authMiddleware, asyncHandler(createMensajeController));

export default router;
