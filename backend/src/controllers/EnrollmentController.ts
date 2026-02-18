import { Request, Response } from "express";
import { EnrollmentService } from "../services/EnrollmentService";
import { CreateEnrollmentDTO } from "../dto/enrollment/CreateEnrollmentDTO";

export class EnrollmentController {
    private enrollmentService: EnrollmentService = new EnrollmentService();

    constructor(enrollmentService: EnrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    async enroll(req: Request, res: Response) {
        const { courseId, periodId, totalExams, gradingSystem }: CreateEnrollmentDTO = req.body;

        const enrollCreated = await this.enrollmentService.enroll({
            periodId,
            courseId,
            totalExams,
            gradingSystem,
        });

        res.status(201).json(enrollCreated);
    }

    async listByPeriod(req: Request, res: Response) {
        const { periodId } = req.body;

        const enrollmentsList =
            await this.enrollmentService.listByPeriod(periodId);

        return res.status(200).json(enrollmentsList);
    }

    async finish(req: Request, res: Response) {
        const { id } = req.params;

        const enrollmentFinished = await this.enrollmentService.finishEnrollment(Number(id));

        return res.status(200).json(enrollmentFinished);
    }
}
