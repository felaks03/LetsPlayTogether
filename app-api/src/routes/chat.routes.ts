import { Router } from "express";
import {
    getChatsController,
    getChatByIdController,
    getOrCreateChatController,
    createMensajeController,
} from "../controllers/chat.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getChatsController);
router.get("/:id", authMiddleware, getChatByIdController);
router.post("/", authMiddleware, getOrCreateChatController);
router.post("/:id/mensajes", authMiddleware, createMensajeController);

export default router;
