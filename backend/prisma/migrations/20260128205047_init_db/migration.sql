-- CreateEnum
CREATE TYPE "StatusPeriod" AS ENUM ('ACTIVE', 'COMPLETED', 'PLANNED');

-- CreateEnum
CREATE TYPE "GradingSystem" AS ENUM ('ARITHMETIC', 'WEIGHTED', 'CUSTOM');

-- CreateEnum
CREATE TYPE "StatusEnrollment" AS ENUM ('IN_PROGRESS', 'APPROVED', 'FAILED');

-- CreateTable
CREATE TABLE "AcademicPeriod" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "StatusPeriod" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "AcademicPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" SERIAL NOT NULL,
    "gradingSystem" "GradingSystem" NOT NULL DEFAULT 'ARITHMETIC',
    "finalAverage" DOUBLE PRECISION,
    "status" "StatusEnrollment" NOT NULL DEFAULT 'IN_PROGRESS',
    "periodId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "semesterLevel" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "obtainedValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "date" TIMESTAMP(3),
    "enrollmentId" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyTask" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "enrollmentId" INTEGER NOT NULL,
    "gradeId" INTEGER,

    CONSTRAINT "StudyTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_periodId_fkey" FOREIGN KEY ("periodId") REFERENCES "AcademicPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyTask" ADD CONSTRAINT "StudyTask_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
