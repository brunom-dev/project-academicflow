import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        return response.status(401).json({
            message: "Token missing",
        });
    }

    const [, token] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        response.locals.user = decoded;
        next();
    } catch {
        return response.status(401).json({
            message: "Unauthorized",
        });
    }
}
