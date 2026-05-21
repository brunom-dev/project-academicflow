import { Request, Response, Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";

import { GradeController } from "../grade/grade.controller";
import { GradeService } from "../grade/grade.service";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const enrollmentService: EnrollmentService = new EnrollmentService();
const enrollmentController: EnrollmentController = new EnrollmentController(
    enrollmentService,
);
const gradeService = new GradeService();
const gradeController = new GradeController(gradeService);

const enrollmentRoutes = Router();

enrollmentRoutes.get(
    "/:id_period",
    authMiddleware,
    (req: Request, res: Response) =>
        enrollmentController.listByPeriod(req, res),
);

enrollmentRoutes.post("/", authMiddleware, (req: Request, res: Response) =>
    enrollmentController.enroll(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/grades/:id_grade",
    authMiddleware,
    (req: Request, res: Response) => gradeController.updateGrade(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/finish",
    authMiddleware,
    (req: Request, res: Response) => enrollmentController.finish(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/avf",
    authMiddleware,
    (req: Request, res: Response) => enrollmentController.avf(req, res),
);

export { enrollmentRoutes };
