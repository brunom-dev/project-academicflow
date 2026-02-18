import { prisma } from "../lib/prisma";
import { EnrollmentService } from "./EnrollmentService";
import { UpdateGradeDTO } from "../dto/grade/UpdateGradeDTO";
import { AppError } from "../errors/AppError";

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

        if (
            obtainedValue !== undefined &&
            obtainedValue > existingGrade.maxValue
        )
            throw new AppError(
                "A nota obtida não pode ser maior que o valor máximo.",
                400,
            );

        const gradeToUpdate = Object.fromEntries(
            Object.entries({
                name,
                obtainedValue,
                maxValue,
                weight,
                date,
            }).filter(([_, value]) => value !== undefined),
        );

        if (Object.entries(gradeToUpdate).length === 0)
            throw new AppError("Sem modificações para atualizar!", 400);

        const gradeUpdated = await prisma.grade.update({
            where: { id: id_grade, enrollmentId: id_enrollment },
            data: gradeToUpdate,
            include: { enrollment: true },
        });

        if (obtainedValue !== undefined) {
            await this.enrollmentService.calculateCurrentAverage(id_enrollment);
        }

        return gradeUpdated;
    }
}
