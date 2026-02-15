import { prisma } from "../lib/prisma";
import { GradingSystem } from "@prisma/client";

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
}
