import { Request, Response, NextFunction } from "express";
import {
    createUser,
    getUsers,
    getUserByIdWithPopulate,
    updateUser,
    deleteUser,
    addAmigo,
    removeAmigo,
    toggleFavoritoVideojuego,
} from "../services/user.service";
import { AppError } from "../middleware/AppError";
import User from "../models/user.model";

export const createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await createUser(req.body);
        const o = user.toObject();
        const { password: _p, ...sinPass } = o;
        res.status(201).json(sinPass);
    } catch (err: any) {
        if (err.code === 11000) {
            return next(new AppError(400, "Ese email ya está registrado"));
        }
        const msg = err.message || "Error al crear usuario";
        next(new AppError(400, msg));
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
    if (String(currentUser.id) !== String(id) && currentUser.role !== "admin") {
        return next(new AppError(403, "Solo puedes editar tu perfil"));
    }
    try {
        const user = await updateUser(id, req.body);
        if (!user) {
            return next(new AppError(404, "Usuario no encontrado"));
        }
        res.json(user);
    } catch (err: any) {
        const msg = err.message || "Error al actualizar";
        next(new AppError(400, msg));
    }
};

export const deleteUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id as string;
    const currentUser = (req as any).user;
    if (String(currentUser.id) !== String(id) && currentUser.role !== "admin") {
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
    if (String(currentUser.id) !== String(userId)) {
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

export const toggleFavoritoController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id as string;
    const videojuegoId = req.params.videojuegoId as string;
    const currentUser = (req as any).user;
    if (String(currentUser.id) !== String(id)) {
        return next(new AppError(403, "Solo puedes cambiar tus favoritos"));
    }
    try {
        const user = await toggleFavoritoVideojuego(id, videojuegoId);
        res.json(user);
    } catch (err: any) {
        const msg = err.message || "Error";
        const status =
            msg === "Videojuego no encontrado" || msg === "Usuario no encontrado"
                ? 404
                : 400;
        next(new AppError(status, msg));
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
    if (String(currentUser.id) !== String(userId)) {
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

export const uploadAvatarController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const id = req.params.id as string;
    const currentUser = (req as any).user;
    if (String(currentUser.id) !== String(id)) {
        return next(new AppError(403, "Solo puedes cambiar tu foto"));
    }
    const file = (req as any).file;
    if (!file) {
        return next(
            new AppError(400, "Selecciona una imagen (JPG, PNG, WebP o GIF)")
        );
    }
    try {
        const fotoPath = `/uploads/avatars/${file.filename}`;
        await User.findByIdAndUpdate(id, { foto: fotoPath });
        const user = await getUserByIdWithPopulate(id);
        res.json(user);
    } catch (err: any) {
        next(err);
    }
};
