import { Request, Response } from "express";

import { CourseService } from "../services/CourseService";
import { CourseType } from "@prisma/client";
import { CreateCourseDTO } from "../dto/modules/course/CreateCourseDTO";


export class CourseController {
    private courserService: CourseService;

    constructor(courserService: CourseService) {
        this.courserService = courserService;
    }

    async create(req: Request, res: Response) {

        const {code, name, semesterLevel, credits, type}: CreateCourseDTO = req.body;

        if (!(Object.values(CourseType).includes(type))) {
            return res.status(400).json({
                error: 'Status inválido.',
                allowedValues: Object.values(CourseType)
            })
        }

        const courseCreated = await this.courserService.create({code, name, semesterLevel, credits, type});

        return res.status(201).json(courseCreated);
    }

    async list(req: Request, res: Response) {
        const courserList = await this.courserService.list();

        return res.status(200).json(courserList);
    }
}