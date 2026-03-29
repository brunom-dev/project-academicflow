import { prisma } from "../lib/prisma";


export class DashboardService {
    async getSummary() {
        const currentPeriod = await prisma.academicPeriod.findFirst({
            where: {
                status: "ACTIVE",
            },
            orderBy: {
                endDate: "desc",
            },
        });

        if (!currentPeriod)
            return {
                currentPeriod: null,
                enrollments: [],
                upcomingTasks: []
            }

        const enrollments = await prisma.enrollment.findMany({
            where: {
                periodId: currentPeriod.id,
            },
            include: {
                course: true
            }
        })

        const upcomingTasks = await prisma.studyTask.findMany({
            where: {
                isCompleted: false,
            },
            include: {
                enrollment: {
                    include: {course: true}
                }
            },
            orderBy: {
                targetDate: 'asc'
            },
            take: 5
        })


        const dataSumarry = {
            currentPeriod: {
                id: currentPeriod.id,
                name: currentPeriod.label,
            },

            enrollments: enrollments.map(enroll =>  ({
                id: enroll.id,
                courseName: enroll.course.name,
                currentAverage: enroll.currentAverage,
                status: enroll.status,
            })),

            upcomingTasks: upcomingTasks.map(task => ({
                id: task.id,
                title:task.title,
                targetDate:task.targetDate,
                courseName: task.enrollment.course.name,
            }))
        }

        return dataSumarry;
    }
}
