import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Acceso solo para admin" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

