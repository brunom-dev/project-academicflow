import { GradingSystem } from "@prisma/client";

export interface CreateEnrollmentDTO {
    periodId: number;
    courseId: number;
    totalExams: number;
    gradingSystem: GradingSystem;
}