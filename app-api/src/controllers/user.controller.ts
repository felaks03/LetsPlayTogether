import { Request, Response } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    getUserByIdWithPopulate,
    updateUser,
    deleteUser,
    addAmigo,
    removeAmigo,
} from "../services/user.service";

export const createUserController = async (req: Request, res: Response) => {
    const user = await createUser(req.body);
    res.status(201).json(user);
};

export const getUsersController = async (_req: Request, res: Response) => {
    const users = await getUsers();
    res.json(users);
};

export const getUserByIdController = async (req: Request, res: Response) => {
    const user = await getUserByIdWithPopulate(req.params.id as string);
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
};

export const updateUserController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== id && currentUser.role !== "admin") {
        return res.status(403).json({ message: "Solo puedes editar tu perfil" });
    }
    const user = await updateUser(id, req.body);
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
};

export const deleteUserController = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== id && currentUser.role !== "admin") {
        return res.status(403).json({ message: "Solo puedes borrar tu perfil" });
    }
    const user = await deleteUser(id);
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
};

export const addAmigoController = async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== userId) {
        return res.status(403).json({ message: "Solo puedes gestionar tus amigos" });
    }
    const friendId = req.body.userId;
    if (!friendId) {
        return res.status(400).json({ message: "Falta userId en el body" });
    }
    try {
        const user = await addAmigo(userId, friendId);
        res.json(user);
    } catch (err: any) {
        if (err.message === "Usuario no encontrado") {
            return res.status(404).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
};

export const removeAmigoController = async (req: Request, res: Response) => {
    const userId = req.params.id as string;
    const friendId = req.params.friendId as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== userId) {
        return res.status(403).json({ message: "Solo puedes gestionar tus amigos" });
    }
    try {
        const user = await removeAmigo(userId, friendId);
        res.json(user);
    } catch (err: any) {
        if (err.message === "Usuario no encontrado") {
            return res.status(404).json({ message: err.message });
        }
        res.status(400).json({ message: err.message });
    }
};
