import { prisma } from '../prisma/client';
import { StatusPeriod } from '@prisma/client'

interface CreatePeriodDTO {
    label: string;
    startDate: string;
    endDate: string;
}

export class PeriodService {
    async create({label, startDate, endDate}: CreatePeriodDTO) {
        const periodAlreadyExists: boolean = Boolean(await prisma.academicPeriod.findFirst({where: {label: label}}));

        if (periodAlreadyExists) throw new Error('Periodo já existe.');

        if (new Date(endDate) <= new Date(startDate)) throw new Error('A data final deve ser maior que a data inicial.');

        return await prisma.academicPeriod.create({
            data: { 
                label,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        })
    }

    async list() {
        return await prisma.academicPeriod.findMany({
            orderBy: { startDate: 'desc'}
        }) 
    }

    async updateStatus(id: number, status: StatusPeriod) {
        const period = await prisma.academicPeriod.findUnique({where: { id }});
            
        if (!period) throw new Error("Periodo não encontrado!");

        return await prisma.academicPeriod.update({
            where: { id },
            data: { status }
        })
    }

}