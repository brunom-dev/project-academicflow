import { Request, Response, Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { EnrollmentService } from "../services/enrollment.service";

import { GradeController } from "../controllers/grade.controller";
import { GradeService } from "../services/grade.service";

const enrollmentService: EnrollmentService = new EnrollmentService();
const enrollmentController: EnrollmentController = new EnrollmentController(
    enrollmentService,
);
const gradeService = new GradeService();
const gradeController = new GradeController(gradeService);

const enrollmentRoutes = Router();

enrollmentRoutes.get("/", (req: Request, res: Response) =>
    enrollmentController.listByPeriod(req, res),
);
enrollmentRoutes.post("/", (req: Request, res: Response) =>
    enrollmentController.enroll(req, res),
);

enrollmentRoutes.patch(
    "/:id_enrollment/grades/:id_grade",
    (req: Request, res: Response) => gradeController.updateGrade(req, res),
);

enrollmentRoutes.patch("/:id/finish", (req: Request, res: Response) =>
    enrollmentController.finish(req, res),
);

export { enrollmentRoutes };
