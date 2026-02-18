import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { CreateTaskDTO } from "../dto/task/CreateTaskDTO";

export class TaskController {
    constructor(private taskService: TaskService) {}

    async create(req: Request, res: Response) {
        const {
            title,
            description,
            targetDate,
            startDate,
            endDate,
            enrollmentId,
            gradeId,
        }: CreateTaskDTO = req.body;

        const task = await this.taskService.create({
            title,
            description,
            targetDate,
            startDate,
            endDate,
            enrollmentId,
            gradeId,
        });

        return res.status(201).json(task);
    }

    async listAll(req: Request, res: Response) {
        const tasks = await this.taskService.listAll();

        return res.status(200).json(tasks);
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { completed } = req.body;

        const taskUpdated = await this.taskService.markAsCompleted(
            Number(id),
            completed,
        );

        return res.status(200).json(taskUpdated);
    }
}
