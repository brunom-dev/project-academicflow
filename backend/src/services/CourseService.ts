import { CreateCourseDTO } from "../dto/course/CreateCourseDTO";
import { AppError } from "../errors/AppError";
import { prisma } from "../lib/prisma";

export class CourseService {
    async create({
        code,
        name,
        semesterLevel,
        credits,
        type,
    }: CreateCourseDTO) {
        const isAlreadyExists = await prisma.course.findUnique({
            where: { code },
        });

        if (isAlreadyExists)
            throw new AppError("Já existe uma disciplina com este código.", 409);

        return await prisma.course.create({
            data: {
                code,
                name,
                credits,
                semesterLevel,
                type,
            },
        });
    }

    async list() {
        return await prisma.course.findMany({
            orderBy: { semesterLevel: "asc" },
        });
    }
}
