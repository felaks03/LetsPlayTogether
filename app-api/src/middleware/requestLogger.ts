import { Request, Response, NextFunction } from "express";

export const requestLogger = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const fecha = new Date().toISOString();
    console.log(`[${fecha}] ${req.method} ${req.originalUrl}`);
    next();
};
