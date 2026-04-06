import User from "../models/user.model";
import { Types } from "mongoose";
import { normalizeAvatarPath } from "../constants/avatars";
import Videojuego from "../models/videojuego.model";
import { validatePassword } from "../utils/passwordPolicy";

function queryUsuarioPopulado(id: string) {
    return User.findById(id)
        .select("-password")
        .populate("favoritos", "titulo imagen")
        .populate("amigos", "nick foto");
}

export const createUser = async (data: any) => {
    const err = validatePassword(data.password);
    if (err) throw new Error(err);
    return await User.create(data);
};

export const getUsers = async () => {
    return await User.find().select("-password");
};

export const getUserById = async (id: string) => {
    return await User.findById(id);
};

export const getUserByIdWithPopulate = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) return null;
    return await queryUsuarioPopulado(id);
};

export const updateUser = async (id: string, data: any) => {
    const patch: any = { ...data };
    if (
        patch.password !== undefined &&
        patch.password !== null &&
        String(patch.password).trim() === ""
    ) {
        delete patch.password;
    }
    if (patch.password !== undefined) {
        const err = validatePassword(String(patch.password));
        if (err) throw new Error(err);
    }
    if (patch.foto !== undefined) {
        patch.foto = normalizeAvatarPath(patch.foto);
    }
    const updated = await User.findByIdAndUpdate(id, patch, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!updated) return null;
    return await queryUsuarioPopulado(id);
};

export const toggleFavoritoVideojuego = async (
    userId: string,
    videojuegoId: string
) => {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(videojuegoId)) {
        throw new Error("IDs inválidos");
    }
    const juego = await Videojuego.findById(videojuegoId);
    if (!juego) throw new Error("Videojuego no encontrado");
    const user = await User.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    const idStr = videojuegoId;
    const idx = user.favoritos.findIndex(
        (f: any) => f.toString() === idStr
    );
    if (idx >= 0) {
        user.favoritos.splice(idx, 1);
    } else {
        user.favoritos.push(new Types.ObjectId(videojuegoId));
    }
    await user.save();
    return await queryUsuarioPopulado(userId);
};

export const deleteUser = async (id: string) => {
    return await User.findByIdAndDelete(id);
};

export const addAmigo = async (userId: string, friendId: string) => {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
        throw new Error("IDs inválidos");
    }
    const user = await User.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    const amigo = await User.findById(friendId);
    if (!amigo) throw new Error("El usuario a añadir no existe");
    if (userId === friendId) throw new Error("No puedes añadirte a ti mismo");
    const yaEsta = user.amigos.some(
        (a: any) => a.toString() === friendId
    );
    if (yaEsta) throw new Error("Ya es tu amigo");
    user.amigos.push(new Types.ObjectId(friendId));
    await user.save();
    return await queryUsuarioPopulado(userId);
};

export const removeAmigo = async (userId: string, friendId: string) => {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(friendId)) {
        throw new Error("IDs inválidos");
    }
    const user = await User.findById(userId);
    if (!user) throw new Error("Usuario no encontrado");
    user.amigos = user.amigos.filter(
        (a: any) => a.toString() !== friendId
    );
    await user.save();
    return await queryUsuarioPopulado(userId);
};
