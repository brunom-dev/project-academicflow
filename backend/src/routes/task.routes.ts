import { Request, Response, Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { TaskService } from "../services/TaskService";

const taskRoutes = Router();

const taskService = new TaskService();
const taskController = new TaskController(taskService);

taskRoutes.post("/", (req: Request, res: Response) =>
    taskController.create(req, res),
);
taskRoutes.get("/", (req: Request, res: Response) =>
    taskController.listAll(req, res),
);
taskRoutes.patch("/:id/complete", (req: Request, res: Response) =>
    taskController.update(req, res),
);

export { taskRoutes };
