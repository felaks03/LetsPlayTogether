import { Request, Response } from "express";
import * as ChatService from "../services/chat.service";

export const getChatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const chats = await ChatService.getChatsByUserId(userId);
    res.json(chats);
};

export const getChatByIdController = async (req: Request, res: Response) => {
    const chatId = req.params.id as string;
    const userId = (req as any).user.id;
    const result = await ChatService.getChatById(chatId, userId);
    if (!result) {
        return res.status(404).json({ message: "Chat no encontrado" });
    }
    res.json(result);
};

export const getOrCreateChatController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const otroUsuarioId = req.body.otroUsuarioId;
    if (!otroUsuarioId) {
        return res.status(400).json({ message: "Falta otroUsuarioId en el body" });
    }
    try {
        const chat = await ChatService.getOrCreateChat(userId, otroUsuarioId);
        res.json(chat);
    } catch (err: any) {
        if (err.message === "IDs inválidos") {
            return res.status(400).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
};

export const createMensajeController = async (req: Request, res: Response) => {
    const chatId = req.params.id as string;
    const emisorId = (req as any).user.id;
    const contenido = req.body.contenido;
    if (!contenido || typeof contenido !== "string") {
        return res.status(400).json({ message: "Falta contenido en el body" });
    }
    try {
        const mensaje = await ChatService.createMensaje(chatId, emisorId, contenido);
        res.status(201).json(mensaje);
    } catch (err: any) {
        if (err.message === "Chat no encontrado") {
            return res.status(404).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
};
