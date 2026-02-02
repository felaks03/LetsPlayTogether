import { Request, Response } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
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
  const user = await getUserById(req.params.id as string);
  res.json(user);
};

export const updateUserController = async (req: Request, res: Response) => {
  const user = await updateUser(req.params.id as string, req.body);
  res.json(user);
};

export const deleteUserController = async (req: Request, res: Response) => {
  await deleteUser(req.params.id as string);
  res.json({ message: "Usuario eliminado" });
};
