import { Request, Response, NextFunction } from "express";
import {
    createUser,
    getUsers,
    getUserByIdWithPopulate,
    updateUser,
    deleteUser,
    addAmigo,
    removeAmigo,
} from "../services/user.service";
import { AppError } from "../middleware/AppError";

export const createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (err: any) {
        next(err);
    }
};

export const getUsersController = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (err: any) {
        next(err);
    }
};

export const getUserByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await getUserByIdWithPopulate(req.params.id as string);
        if (!user) {
            return next(new AppError(404, "Usuario no encontrado"));
        }
        res.json(user);
    } catch (err: any) {
        next(err);
    }
};

export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== id && currentUser.role !== "admin") {
        return next(new AppError(403, "Solo puedes editar tu perfil"));
    }
    try {
        const user = await updateUser(id, req.body);
        if (!user) {
            return next(new AppError(404, "Usuario no encontrado"));
        }
        res.json(user);
    } catch (err: any) {
        next(err);
    }
};

export const deleteUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== id && currentUser.role !== "admin") {
        return next(new AppError(403, "Solo puedes borrar tu perfil"));
    }
    try {
        const user = await deleteUser(id);
        if (!user) {
            return next(new AppError(404, "Usuario no encontrado"));
        }
        res.json({ message: "Usuario eliminado" });
    } catch (err: any) {
        next(err);
    }
};

export const addAmigoController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.id as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== userId) {
        return next(new AppError(403, "Solo puedes gestionar tus amigos"));
    }
    const friendId = req.body.userId;
    if (!friendId) {
        return next(new AppError(400, "Falta userId en el body"));
    }
    try {
        const user = await addAmigo(userId, friendId);
        res.json(user);
    } catch (err: any) {
        const es404 =
            err.message === "Usuario no encontrado" ||
            err.message === "El usuario a añadir no existe";
        next(new AppError(es404 ? 404 : 400, err.message));
    }
};

export const removeAmigoController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.id as string;
    const friendId = req.params.friendId as string;
    const currentUser = (req as any).user;
    if (currentUser.id !== userId) {
        return next(new AppError(403, "Solo puedes gestionar tus amigos"));
    }
    try {
        const user = await removeAmigo(userId, friendId);
        res.json(user);
    } catch (err: any) {
        const status = err.message === "Usuario no encontrado" ? 404 : 400;
        next(new AppError(status, err.message));
    }
};
