import { CourseType } from "@prisma/client";

export interface CreateCourseDTO {
    code: string;
    name: string;
    semesterLevel: number;
    credits: number;
    type: CourseType;
}

