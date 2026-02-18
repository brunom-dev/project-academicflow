import { Request, Response } from "express";
import { PeriodService } from "../services/PeriodService";
import { StatusPeriod } from "@prisma/client";
import { CreatePeriodDTO } from "../dto/period/CreatePeriodDTO";
import { UpdatePeriodDTO } from "../dto/period/UpdatePeriodDTO";

export class PeriodController {
    private periodService: PeriodService;

    constructor(periodService: PeriodService) {
        this.periodService = periodService;
    }

    async create(req: Request, res: Response) {
        const { label, startDate, endDate }: CreatePeriodDTO = req.body;

        const periodCreated = await this.periodService.create({
            label,
            startDate,
            endDate,
        });

        return res.status(201).json(periodCreated);
    }

    async list(req: Request, res: Response) {
        const periodList = await this.periodService.list();
        return res.status(200).json(periodList);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { status }: UpdatePeriodDTO = req.body;

        if (!Object.values(StatusPeriod).includes(status)) {
            return res.status(400).json({
                error: "Status inválido.",
                allowedValues: Object.values(StatusPeriod),
            });
        }

        const periodUpdated = await this.periodService.updateStatus(
            Number(id),
            { status },
        );

        return res.status(200).json(periodUpdated);
    }
}
