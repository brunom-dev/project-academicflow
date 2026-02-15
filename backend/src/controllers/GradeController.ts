import { Request, Response } from "express";
import { GradeService } from "../services/GradeService";

export class GradeController {
    constructor(private gradeService: GradeService) {}

    async updateGrade(req: Request, res: Response) {
        const { id_enrollment, id_grade } = req.params;
        const { name, obtainedValue, maxValue, weight, date } = req.body;

        if (
            name === undefined &&
            obtainedValue === undefined &&
            maxValue === undefined &&
            weight === undefined &&
            date === undefined
        )
            return res
                .status(400)
                .json({ error: "Não há modificações para atualizar." });

        const gradeUpdated = await this.gradeService.update(
            Number(id_grade),
            Number(id_enrollment),
            {
                name,
                obtainedValue,
                maxValue,
                weight,
                date,
            },
        );

        return res.status(200).json(gradeUpdated);
    }
}
