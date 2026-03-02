import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export const errorHandler = (
    err: Error | AppError | any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = 500;
    let message = err.message || "Error interno del servidor";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
    } else if (err.name === "ValidationError" && err.errors) {
        statusCode = 400;
        const firstError = Object.values(err.errors)[0] as any;
        message = firstError?.message || err.message;
    }
    const fecha = new Date().toISOString();

    console.error(`[${fecha}] ERROR`);
    console.error(`  Ruta: ${req.method} ${req.originalUrl}`);
    console.error(`  Status: ${statusCode}`);
    console.error(`  Mensaje: ${message}`);
    if (err.stack) {
        console.error(`  Stack: ${err.stack}`);
    }

    res.status(statusCode).json({
        message,
    });
};
