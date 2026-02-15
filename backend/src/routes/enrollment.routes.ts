import { Request, Response, Router } from "express";
import { EnrollmentController } from "../controllers/EnrollmentController";
import { EnrollmentService } from "../services/EnrollmentService";

import { GradeController } from "../controllers/GradeController";
import { GradeService } from "../services/GradeService";

const enrollmentService: EnrollmentService = new EnrollmentService();
const enrollmentController: EnrollmentController = new EnrollmentController(enrollmentService);
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
    (req: Request, res: Response) => gradeController.updateGrade(req, res)
);



export { enrollmentRoutes };
