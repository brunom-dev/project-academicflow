import { Request, Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { CreateEnrollmentDTO } from "./enrollment.dto";
import { AppError } from "../../shared/errors/AppError";

export class EnrollmentController {
    private enrollmentService: EnrollmentService = new EnrollmentService();

    constructor(enrollmentService: EnrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    async enroll(req: Request, res: Response) {
        const {
            courseId,
            periodId,
            totalExams,
            gradingSystem,
        }: CreateEnrollmentDTO = req.body;

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
        const { id_enrollment } = req.params;

        const enrollmentFinished =
            await this.enrollmentService.finishEnrollment(
                Number(id_enrollment),
            );

        return res.status(200).json(enrollmentFinished);
    }

    async avf(req: Request, res: Response) {
        const { id_enrollment } = req.params;
        const { finalExamGrade } = req.body;

        if (id_enrollment === undefined)
            throw new AppError("A matricula é obrigatória", 400);

        if (finalExamGrade === undefined)
            throw new AppError(
                "O resultado da avalição final é obrigatória",
                400,
            );

        const enrollmentFinished = await this.enrollmentService.avf(
            Number(id_enrollment),
            Number(finalExamGrade),
        );

        return res.status(200).json(enrollmentFinished);
    }
}
