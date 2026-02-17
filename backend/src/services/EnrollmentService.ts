import { prisma } from "../lib/prisma";
import { GradingSystem, StatusEnrollment } from "@prisma/client";
import { calculateAverage } from "../utils/calculateAverage";

interface CreateEnrollmentDTO {
    periodId: number;
    courseId: number;
    totalExams: number;
    gradingSystem: GradingSystem;
}

export class EnrollmentService {
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
            throw new Error(
                "Aluno já matriculado nesta disciplina nesse periodo",
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

        if (!enrollment) throw new Error("Matricula não encontrada");

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

        const currentAverage = calculateAverage(completedGrades);

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

        if (!enrollment)
            throw new Error(
                "Erro ao finalizar disciplina: A disciplina não foi encontrada.",
            );

        const hasPendingGrade: boolean = enrollment.grades.some(grade => grade.obtainedValue === null);

        if (hasPendingGrade) 
            throw new Error('Erro ao finalizar disciplina: Há provas pendentes.');

        const finalAverage = calculateAverage(enrollment.grades);

        const result: StatusEnrollment = finalAverage >= 7 ? 'APPROVED' : 'FAILED'; 

        // todo - (REFACTOR) add possibilidade de AVF. (>= 4 and < 7) => +1 grade;

        const enrollmentFinish = await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { 
                finalAverage,
                status:  result
            
            },
            include: { 
                grades: true,
                period: true,
                course: true,
            },
        });

        return enrollmentFinish;
    }
}
