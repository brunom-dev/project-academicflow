import "express-async-errors";
import "dotenv/config";
import express, {
    type Request,
    type Response,
    type NextFunction,
} from "express";
import cors from "cors";

import { AppError } from "./shared/errors/AppError";
import { periodRoutes } from "./routes/period.routes";
import { courseRoutes } from "./modules/course/course.routes";
import { enrollmentRoutes } from "./routes/enrollment.routes";
import { taskRoutes } from "./routes/task.routes";

import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/periods", periodRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: err.message,
        });
    }

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error",
    });
});

export { app };
