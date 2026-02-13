-- CreateEnum
CREATE TYPE "CourseType" AS ENUM ('REQUIRED', 'ELECTIVE');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "type" "CourseType" NOT NULL DEFAULT 'REQUIRED';
