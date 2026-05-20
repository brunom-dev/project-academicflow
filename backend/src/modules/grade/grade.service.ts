import { prisma } from "../../shared/lib/prisma";
import { EnrollmentService } from "../enrollment/enrollment.service";
import { UpdateGradeDTO } from "./grade.dto";
import { AppError } from "../../shared/errors/AppError";

export class GradeService {
    private enrollmentService = new EnrollmentService();

    async update(
        id_grade: number,
        id_enrollment: number,
        { name, obtainedValue, maxValue, weight, date }: UpdateGradeDTO,
    ) {
        if (maxValue !== undefined && maxValue <= 0)
            throw new AppError("O valor máximo deve ser maior que zero.", 400);
        if (weight !== undefined && weight <= 0)
            throw new AppError("O peso da nota deve ser maior que zero.", 400);
        if (obtainedValue !== undefined && obtainedValue < 0)
            throw new AppError("A nota não pode ser negativa.", 400);

        const existingGrade = await prisma.grade.findFirst({
            where: {
                id: id_grade,
                enrollmentId: id_enrollment,
            },
        });

        if (!existingGrade)
            throw new AppError(
                "Nota não encontrada ou não pertence a esta matricula.",
                404,
            );

        const currentMaxValue =
            maxValue !== undefined ? maxValue : existingGrade.maxValue;

        if (obtainedValue !== undefined && obtainedValue > currentMaxValue) {
            throw new AppError(
                "A nota obtida não pode ser maior que o valor máximo.",
                400,
            );
        }

        const gradeUpdated = await prisma.grade.update({
            where: { id: id_grade, enrollmentId: id_enrollment },
            data: { name, obtainedValue, maxValue, weight, date },
            include: { enrollment: true },
        });

        if (obtainedValue !== undefined) {
            await this.enrollmentService.calculateCurrentAverage(id_enrollment);
        }

        return gradeUpdated;
    }
}
