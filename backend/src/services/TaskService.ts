import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";

export interface CreateTaskDTO {
    title: string;
    description?: string;
    targetDate: Date;
    startDate?: Date;
    endDate?: Date;
    enrollmentId: number;
    gradeId?: number;
}

export class TaskService {
    async create({
        title,
        description,
        targetDate,
        startDate,
        endDate,
        enrollmentId,
        gradeId,
    }: CreateTaskDTO) {
        if (startDate && endDate && new Date(startDate) > new Date(endDate))
            throw new AppError(
                "A data termino não pode ser anterior à data de inicio.",
                400,
            );

        const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
        });

        if (!enrollment) throw new AppError("Matricula não encontrada", 404);

        if (gradeId) {
            const grade = await prisma.grade.findFirst({
                where: {
                    id: gradeId,
                    enrollmentId: enrollmentId,
                },
            });

            if (!grade)
                throw new AppError(
                    "A avaliação informada não pertence a está matricula",
                    400,
                );
        }

        const taskCreated = await prisma.studyTask.create({
            data: {
                title,
                description,
                targetDate,
                startDate,
                endDate,
                enrollmentId,
                gradeId,
            },

            include: {
                enrollment: true,
                grade: true,
            },
        });

        return taskCreated;
    }

    async listAll() {
        const tasks = await prisma.studyTask.findMany({
            orderBy: {
                targetDate: "asc"
            },
            include: {
                enrollment: true,
                grade: true
            }
        });

        return tasks;
    }

    async markAsCompleted(taskId: number, completed: boolean) {
        const task = await prisma.studyTask.findUnique({
            where: { id: taskId },
        });

        if (!task) throw new AppError("Tarefa não encontrada", 404);

        const taskCompleted = await prisma.studyTask.update({
            where: { id: taskId },
            data: {
                isCompleted: completed,
            },
            include: {
                enrollment: true,
            },
        });

        return taskCompleted;
    }
}
