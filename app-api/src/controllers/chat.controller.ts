import { Request, Response, NextFunction } from "express";
import * as ChatService from "../services/chat.service";
import { AppError } from "../middleware/AppError";

export const getChatsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user.id;
        const chats = await ChatService.getChatsByUserId(userId);
        res.json(chats);
    } catch (err: any) {
        next(err);
    }
};

export const getChatByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const chatId = req.params.id as string;
        const userId = (req as any).user.id;
        const result = await ChatService.getChatById(chatId, userId);
        if (!result) {
            return next(new AppError(404, "Chat no encontrado"));
        }
        res.json(result);
    } catch (err: any) {
        next(err);
    }
};

export const getOrCreateChatController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = (req as any).user.id;
    const otroUsuarioId = req.body.otroUsuarioId;
    if (!otroUsuarioId) {
        return next(new AppError(400, "Falta otroUsuarioId en el body"));
    }
    try {
        const chat = await ChatService.getOrCreateChat(userId, otroUsuarioId);
        res.json(chat);
    } catch (err: any) {
        next(new AppError(400, err.message));
    }
};

export const createMensajeController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const chatId = req.params.id as string;
    const emisorId = (req as any).user.id;
    const contenido = req.body.contenido;
    if (!contenido || typeof contenido !== "string") {
        return next(new AppError(400, "Falta contenido en el body"));
    }
    try {
        const mensaje = await ChatService.createMensaje(
            chatId,
            emisorId,
            contenido
        );
        res.status(201).json(mensaje);
    } catch (err: any) {
        const status = err.message === "Chat no encontrado" ? 404 : 400;
        next(new AppError(status, err.message));
    }
};
