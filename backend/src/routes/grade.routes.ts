import { Router, Request, Response } from "express";
import { GradeController } from "../controllers/GradeController";
import { GradeService } from "../services/GradeService";

const gradeService: GradeService = new GradeService();
const gradeController: GradeController = new GradeController(gradeService);

const gradeRoutes = Router();

gradeRoutes.patch("/:id", (req: Request, res: Response) =>
    gradeController.updateGrade(req, res),
);

export { gradeRoutes };