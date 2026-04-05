import { CreatePeriodDTO, UpdatePeriodDTO } from "./period.dto";
import { AppError } from "../../shared/errors/AppError";
import { prisma } from "../../shared/lib/prisma";

export class PeriodService {
    async create({ label, startDate, endDate }: CreatePeriodDTO) {
        const periodAlreadyExists: boolean = Boolean(
            await prisma.academicPeriod.findFirst({ where: { label: label } }),
        );

        if (periodAlreadyExists) throw new AppError("Periodo já existe.", 409);

        if (new Date(endDate) <= new Date(startDate))
            throw new AppError(
                "A data final deve ser maior que a data inicial.",
                400,
            );

        return await prisma.academicPeriod.create({
            data: {
                label,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });
    }

    async list() {
        return await prisma.academicPeriod.findMany({
            orderBy: { startDate: "desc" },
        });
    }

    async updateStatus(id: number, { status }: UpdatePeriodDTO) {
        const period = await prisma.academicPeriod.findUnique({
            where: { id },
        });

        if (!period) throw new AppError("Periodo não encontrado!", 404);

        return await prisma.academicPeriod.update({
            where: { id },
            data: { status },
        });
    }
}
