import User from "../models/user.model";
import { Types } from "mongoose";

export const createUser = async (data: any) => {
    return await User.create(data);
};

export const getUsers = async () => {
    return await User.find();
};

export const getUserById = async (id: string) => {
    return await User.findById(id);
};

export const getUserByIdWithPopulate = async (id: string) => {
    if (!Types.ObjectId.isValid(id)) return null;
    return await User.findById(id)
        .populate("favoritos")
        .populate("amigos");
};

export const updateUser = async (id: string, data: any) => {
    return await User.findByIdAndUpdate(id, data, { new: true });
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
    return user;
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
    return user;
};
