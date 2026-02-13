import { Router, Request, Response } from "express";

import { CourseService } from "../services/CourseService";
import { CourseController } from '../controllers/CourseController';

const courserService = new CourseService();
const courseController = new CourseController(courserService);

const courseRoutes = Router();

courseRoutes.post('/', (req: Request, res: Response) => courseController.create(req, res));
courseRoutes.get('/', (req: Request, res: Response) => courseController.list(req, res));

export { courseRoutes };