/*
  Warnings:

  - A unique constraint covering the columns `[name,enrollmentId]` on the table `Grade` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Grade" DROP CONSTRAINT "Grade_enrollmentId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Grade_name_enrollmentId_key" ON "Grade"("name", "enrollmentId");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
