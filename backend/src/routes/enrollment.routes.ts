import { Request, Response, Router } from "express";
import { EnrollmentController } from "../controllers/EnrollmentController";
import { EnrollmentService } from "../services/EnrollmentService";

const enrollmentRoutes = Router();

const enrollmentService: EnrollmentService = new EnrollmentService();
const enrollmentController: EnrollmentController = new EnrollmentController(
    enrollmentService,
);

enrollmentRoutes.get("/", (req: Request, res: Response) =>
    enrollmentController.listByPeriod(req, res),
);
enrollmentRoutes.post("/", (req: Request, res: Response) =>
    enrollmentController.enroll(req, res),
);

export { enrollmentRoutes };
