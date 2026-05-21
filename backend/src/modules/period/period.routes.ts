import { Request, Response, Router } from "express";
import { PeriodController } from "./period.controller";
import { PeriodService } from "./period.service";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const periodRoutes = Router();

const periodService = new PeriodService();
const periodController = new PeriodController(periodService);

periodRoutes.get("/", authMiddleware, (req: Request, res: Response) =>
    periodController.list(req, res),
);
periodRoutes.post("/", authMiddleware, (req: Request, res: Response) =>
    periodController.create(req, res),
);
periodRoutes.patch("/:id", authMiddleware, (req: Request, res: Response) =>
    periodController.update(req, res),
);

export { periodRoutes };
