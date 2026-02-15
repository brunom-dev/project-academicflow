import { prisma } from "../lib/prisma";

interface UpdateGradeDTO {
    name?: string;
    obtainedValue?: number;
    maxValue?: number;
    weight?: number;
    date?: Date;
}

export class GradeService {
    async update(
        id: number,
        { name, obtainedValue, maxValue, weight, date }: UpdateGradeDTO,
    ) {
        if (maxValue !== undefined && maxValue <= 0)
            throw new Error("O valor máximo deve ser maior que zero.");
        if (weight !== undefined && weight <= 0)
            throw new Error("O peso da nota deve ser maior que zero.");
        if (obtainedValue !== undefined) {
            if (obtainedValue < 0)
                throw new Error("A nota não pode ser negativa.");
            else if (maxValue !== undefined && obtainedValue > maxValue)
                throw new Error(
                    "A nota obtida não pode ser maior que o valor máximo.",
                );
        }

        const gradeToUpdate = Object.fromEntries(
            Object.entries({
                name,
                obtainedValue,
                maxValue,
                weight,
                date,
            }).filter(([_, value]) => value !== undefined),
        );

        if (Object.entries(gradeToUpdate).length === 0)
            throw new Error("Sem modificações para atualizar!");

        const gradeUpdated = await prisma.grade.update({
            where: { id },
            data: gradeToUpdate,
        });

        return gradeUpdated;
    }
}
