import { Request, Response } from "express";
import { register } from "./auth.service";
import { login } from "./auth.service";

export const registerController = async (req: Request, res: Response) => {
    const user = await register(req.body);
    res.status(201).json(user);
};

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await login(email, password);

    if (!result) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    res.json(result);
};

