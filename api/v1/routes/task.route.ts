import { Router } from "express";
const router: Router = Router();

import * as controllers from "../controllers/task.controller";

router.get("/", controllers.index);

router.get("/detail/:id", controllers.detail);

router.patch("/change-status/:id", controllers.changeStatus);

router.patch("/change-multi", controllers.changeMulti);

router.post("/create", controllers.create);

router.patch("/edit/:id", controllers.edit);

router.delete("/delete/:id", controllers.deleteTask);

export const taskRoutes: Router = router;
