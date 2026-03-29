import { Request, Response, Router } from "express";
import { PeriodController } from "../controllers/period.controller";
import { PeriodService } from "../services/period.service";

const periodRoutes = Router();

const periodService = new PeriodService();
const periodController = new PeriodController(periodService);

periodRoutes.get("/", (req: Request, res: Response) =>
    periodController.list(req, res),
);
periodRoutes.post("/", (req: Request, res: Response) =>
    periodController.create(req, res),
);
periodRoutes.patch("/:id", (req: Request, res: Response) =>
    periodController.update(req, res),
);

export { periodRoutes };
