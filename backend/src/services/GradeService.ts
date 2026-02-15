import { prisma } from "../lib/prisma";
import { EnrollmentService } from "./EnrollmentService";

interface UpdateGradeDTO {
    name?: string;
    obtainedValue?: number;
    maxValue?: number;
    weight?: number;
    date?: Date;
}

export class GradeService {

    private enrollmentService = new EnrollmentService();

    async update(
        id_grade: number,
        id_enrollment: number, 
        { name, obtainedValue, maxValue, weight, date }: UpdateGradeDTO,
    ) {
        if (maxValue !== undefined && maxValue <= 0)
            throw new Error("O valor máximo deve ser maior que zero.");
        if (weight !== undefined && weight <= 0)
            throw new Error("O peso da nota deve ser maior que zero.");
        if (obtainedValue !== undefined && obtainedValue < 0)
            throw new Error("A nota não pode ser negativa.");

        const existingGrade = await prisma.grade.findFirst({
            where: { 
                id: id_grade,
                enrollmentId: id_enrollment 
            }
        });

        if (!existingGrade)
            throw new Error('Nota não encontrada ou não pertence a esta matricula.');

        if (obtainedValue !== undefined && obtainedValue > existingGrade.maxValue)
            throw new Error('A nota obtida não pode ser maior que o valor máximo.')

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
            throw new Error("Sem modificações para atualizar!");

        const gradeUpdated = await prisma.grade.update({
            where: { id: id_grade, enrollmentId: id_enrollment },
            data: gradeToUpdate,
            include: {enrollment: true}
        });

        if (obtainedValue !== undefined) {
            await this.enrollmentService.calculateCurrentAverage(id_enrollment);
        }

        return gradeUpdated;
    }
}
