import { Request, Response, Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { EnrollmentService } from "./enrollment.service";

import { GradeController } from "../grade/grade.controller";
import { GradeService } from "../grade/grade.service";

const enrollmentService: EnrollmentService = new EnrollmentService();
const enrollmentController: EnrollmentController = 
    new EnrollmentController(enrollmentService);
const gradeService = new GradeService();
const gradeController = new GradeController(gradeService);

const enrollmentRoutes = Router();

enrollmentRoutes.get(
    "/", 
    (req: Request, res: Response) => enrollmentController.listByPeriod(req, res),
);

enrollmentRoutes.post(
    "/", 
    (req: Request, res: Response) => enrollmentController.enroll(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/grades/:id_grade",
    (req: Request, res: Response) => gradeController.updateGrade(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/finish", 
    (req: Request, res: Response) => enrollmentController.finish(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/avf",
    (req: Request, res: Response) => enrollmentController.avf(req, res),
);

export { enrollmentRoutes };
