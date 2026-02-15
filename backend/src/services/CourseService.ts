import { prisma } from "../lib/prisma";
import { CourseType } from "@prisma/client";

interface CreateCourseDTO {
    code: string;
    name: string;
    semesterLevel: number;
    credits: number;
    type: CourseType;
}

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
            throw new Error("Já existe uma disciplina com este código.");

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
