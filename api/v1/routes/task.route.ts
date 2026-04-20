import { Router, Request, Response } from "express";
import Task from "../models/task.model";
const router: Router = Router();

import * as controllers from "../controllers/task.controller";

router.get("/", controllers.index);

router.get("/detail/:id", controllers.detail);

export const taskRoutes: Router = router;
