import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function validateSchema(schema: ZodSchema) {
    return (request: Request, response: Response, next: NextFunction) => {
        const result = schema.safeParse(request.body);
        if (!result.success) {
            const errors = result.error.issues.map((issue) => ({
                field: issue.path[0],
                message: issue.message,
            }));

            return response.status(400).json({
                message: "Validation error",
                errors,
            });
        }

        request.body = result.data;

        next();
    };
}
