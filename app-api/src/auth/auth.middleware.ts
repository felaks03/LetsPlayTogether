import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../middleware/AppError";

export const authMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError(401, "Token requerido"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );
        (req as any).user = { id: decoded.id, role: decoded.role };
        next();
    } catch (_error) {
        next(new AppError(401, "Token inválido"));
    }
};

export const adminMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new AppError(401, "Token requerido"));
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        if (decoded.role !== "admin") {
            return next(new AppError(403, "Acceso solo para admin"));
        }

        next();
    } catch (_error) {
        next(new AppError(401, "Token inválido"));
    }
};

