import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
    private dashboardService: DashboardService;

    constructor(dashboardService: DashboardService) {
        this.dashboardService = dashboardService;
    }

    async getSummary(req: Request, res: Response) {
        const summary = await this.dashboardService.getSummary();

        return res.status(200).json(summary);
    }
    
}