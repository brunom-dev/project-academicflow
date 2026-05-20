import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function validateSchema(schema: ZodSchema) {
    return (request: Request, response: Response, next: NextFunction) => {
        const result = schema.safeParse(request.body);

        if (!result.success) {
            return response.status(400).json({
                message: "Validation error",
                errors: result.error.format(),
            });
        }

        request.body = result.data;

        next();
    };
}
