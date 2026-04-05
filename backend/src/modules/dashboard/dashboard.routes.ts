import { Request, Response, Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

const dashboardRoutes = Router();

const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

dashboardRoutes.get("/summary", (req: Request, res: Response) =>
    dashboardController.getSummary(req, res),
);

export { dashboardRoutes };
