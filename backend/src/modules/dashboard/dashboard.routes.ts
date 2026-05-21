import { Request, Response, Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const dashboardRoutes = Router();

const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

dashboardRoutes.get("/summary", authMiddleware, (req: Request, res: Response) =>
    dashboardController.getSummary(req, res),
);

export { dashboardRoutes };
