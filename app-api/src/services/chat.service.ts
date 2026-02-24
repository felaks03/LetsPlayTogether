import Chat from "../models/chat.model";
import Mensaje from "../models/mensaje.model";
import { Types } from "mongoose";

export const getChatsByUserId = async (userId: string) => {
    if (!Types.ObjectId.isValid(userId)) return [];
    return await Chat.find({
        $or: [
            { participante1: userId },
            { participante2: userId },
        ],
    })
        .populate("participante1", "nick foto")
        .populate("participante2", "nick foto")
        .sort({ fechaCreacion: -1 });
};

export const getChatById = async (chatId: string, userId: string) => {
    if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(userId)) {
        return null;
    }
    const chat = await Chat.findById(chatId)
        .populate("participante1", "nick foto")
        .populate("participante2", "nick foto");
    if (!chat) return null;
    const p1 = (chat.participante1 as any)._id.toString();
    const p2 = (chat.participante2 as any)._id.toString();
    if (p1 !== userId && p2 !== userId) return null;
    const mensajes = await Mensaje.find({ chat: chatId })
        .populate("emisor", "nick foto")
        .sort({ fecha: 1 });
    return { chat, mensajes };
};

export const getOrCreateChat = async (userId: string, otroUsuarioId: string) => {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(otroUsuarioId)) {
        throw new Error("IDs inválidos");
    }
    if (userId === otroUsuarioId) throw new Error("No puedes crear chat contigo mismo");
    let chat = await Chat.findOne({
        $or: [
            { participante1: userId, participante2: otroUsuarioId },
            { participante1: otroUsuarioId, participante2: userId },
        ],
    })
        .populate("participante1", "nick foto")
        .populate("participante2", "nick foto");
    if (!chat) {
        chat = await Chat.create({
            participante1: userId,
            participante2: otroUsuarioId,
        });
        chat = await Chat.findById(chat._id)
            .populate("participante1", "nick foto")
            .populate("participante2", "nick foto");
    }
    return chat;
};

export const createMensaje = async (
    chatId: string,
    emisorId: string,
    contenido: string
) => {
    if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(emisorId)) {
        throw new Error("IDs inválidos");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) throw new Error("Chat no encontrado");
    const p1 = chat.participante1.toString();
    const p2 = chat.participante2.toString();
    if (p1 !== emisorId && p2 !== emisorId) {
        throw new Error("No eres participante de este chat");
    }
    const mensaje = await Mensaje.create({
        chat: chatId,
        emisor: emisorId,
        contenido,
    });
    return await Mensaje.findById(mensaje._id).populate("emisor", "nick foto");
};
