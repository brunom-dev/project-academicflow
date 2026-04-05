-- AlterEnum
ALTER TYPE "StatusEnrollment" ADD VALUE 'AVF';

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "finalExamGrade" DOUBLE PRECISION;
