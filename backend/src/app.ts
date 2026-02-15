import "express-async-errors";
import "dotenv/config";
import express, {
    type Request,
    type Response,
    type NextFunction,
} from "express";
import cors from "cors";

import { periodRoutes } from "./routes/period.routes";
import { courseRoutes } from "./routes/course.routes";
import { enrollmentRoutes } from "./routes/enrollment.routes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/periods", periodRoutes);
app.use("/course", courseRoutes);
app.use("/enrollment", enrollmentRoutes);

// Middleware de Erro Global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error: err.message,
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
});

export { app };
