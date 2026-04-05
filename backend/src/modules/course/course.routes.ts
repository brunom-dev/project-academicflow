import { Router, Request, Response } from "express";

import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";

const courserService = new CourseService();
const courseController = new CourseController(courserService);

const courseRoutes = Router();

courseRoutes.post("/", (req: Request, res: Response) =>
    courseController.create(req, res),
);
courseRoutes.get("/", (req: Request, res: Response) =>
    courseController.list(req, res),
);

export { courseRoutes };
