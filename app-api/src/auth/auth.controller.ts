import { Request, Response, NextFunction } from "express";
import { register, login } from "./auth.service";
import { AppError } from "../middleware/AppError";

export const registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await register(req.body);
        res.status(201).json(user);
    } catch (err: any) {
        next(err);
    }
};

export const loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;
        const result = await login(email, password);
        if (!result) {
            return next(new AppError(401, "Credenciales incorrectas"));
        }
        res.json(result);
    } catch (err: any) {
        next(err);
    }
};
