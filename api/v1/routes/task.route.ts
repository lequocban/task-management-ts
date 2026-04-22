import { Router, Request, Response } from "express";
const router: Router = Router();

import * as controllers from "../controllers/task.controller";

router.get("/", controllers.index);

router.get("/detail/:id", controllers.detail);

router.patch("/change-status/:id", controllers.changeStatus);

router.patch("/change-multi", controllers.changeMulti);

export const taskRoutes: Router = router;
