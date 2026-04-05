import { CreateEnrollmentDTO } from "../dto/enrollment/CreateEnrollmentDTO";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";
import { StatusEnrollment, Grade } from "@prisma/client";

export class EnrollmentService {
    private calculateAverage(grades: Grade[]): number {
        let totalPoints: number = 0;
        let totalWeights: number = 0;

        grades.forEach((grade) => {
            totalPoints += Number(grade.obtainedValue) * grade.weight;
            totalWeights += grade.weight;
        });

        return totalWeights > 0 ? totalPoints / totalWeights : 0;
    }

    private finalResult(finalAverage: number): StatusEnrollment {
        if (finalAverage >= 7 && finalAverage <= 10) return "APPROVED";
        if (finalAverage >= 4 && finalAverage < 7) return "AVF";
        if (finalAverage >= 0 && finalAverage < 4) return "FAILED";

        return "IN_PROGRESS";
    }

    async enroll({
        periodId,
        courseId,
        totalExams,
        gradingSystem,
    }: CreateEnrollmentDTO) {
        const alreadyEnrolled = await prisma.enrollment.findFirst({
            where: {
                courseId,
                periodId,
            },
        });

        if (alreadyEnrolled)
            throw new AppError(
                "Aluno já matriculado nesta disciplina nesse periodo",
                409,
            );

        const gradesToCreate = [];
        for (let i = 1; i <= totalExams; i++) {
            gradesToCreate.push({
                name: `P${i}`,
                weight: 1.0,
            });
        }

        const enrollment = await prisma.enrollment.create({
            data: {
                periodId,
                courseId,
                gradingSystem,
                status: "IN_PROGRESS",

                grades: {
                    create: gradesToCreate,
                },
            },

            include: {
                course: true,
                grades: true,
            },
        });

        return enrollment;
    }

    async listByPeriod(periodId: number) {
        return await prisma.enrollment.findMany({
            where: { periodId },
            include: {
                course: true,
                grades: {
                    orderBy: { name: "asc" },
                },
            },
        });
    }

    async calculateCurrentAverage(enrollmentId: number) {
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
            include: { grades: true },
        });

        if (!enrollment) throw new AppError("Matricula não encontrada", 404);

        const completedGrades = enrollment.grades.filter(
            (grade) => grade.obtainedValue !== null,
        );

        if (completedGrades.length === 0) {
            await prisma.enrollment.update({
                where: { id: enrollmentId },
                data: { currentAverage: null },
            });

            return null;
        }

        const currentAverage = this.calculateAverage(completedGrades);

        await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { currentAverage },
        });

        return currentAverage;
    }

    async finishEnrollment(enrollmentId: number) {
        const enrollment = await prisma.enrollment.findFirst({
            where: { id: enrollmentId },
            include: { grades: true },
        });

        if (!enrollment) throw new AppError("Matricula não encontrada.", 404);

        const hasPendingGrade: boolean = enrollment.grades.some(
            (grade) => grade.obtainedValue === null,
        );

        if (hasPendingGrade) throw new AppError("Há provas pendentes.", 400);

        const finalAverage = this.calculateAverage(enrollment.grades);

        const result: StatusEnrollment = this.finalResult(finalAverage);

        const enrollmentFinish = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                finalAverage,
                status: result,
            },
            include: {
                grades: true,
                period: true,
                course: true,
            },
        });

        return enrollmentFinish;
    }

    async avf(enrollmentId: number, finalExamGrade: number) {
        const enrollment = await prisma.enrollment.findFirst({
            where: { id: enrollmentId },
        });

        if (!enrollment) throw new AppError("Matricula não encontrada.", 404);
        if (enrollment.status !== "AVF")
            throw new AppError("Aluno não está de Avaliação final.", 400);

        if (finalExamGrade < 0 || finalExamGrade > 10)
            throw new AppError(
                "O resultado da avaliação final deve está no intervalo [0, 10]",
                400,
            );

        // MEDIA FINAL = (MEDIA PARCIAL + NOTA AVALIACAO FINAL) / 2

        const finalAverageWithAVF =
            (Number(enrollment.finalAverage) + finalExamGrade) / 2;
        const resultWithAVF: StatusEnrollment =
            finalAverageWithAVF >= 5 ? "APPROVED" : "FAILED";

        const enrollmentFinished = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: {
                finalExamGrade: finalExamGrade,
                finalAverage: finalAverageWithAVF,
                status: resultWithAVF,
            },
            include: {
                grades: true,
                period: true,
                course: true,
            },
        });

        return enrollmentFinished;
    }
}
