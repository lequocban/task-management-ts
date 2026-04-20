import { Router, Request, Response } from "express";
import Task from "../../../models/task.model";
const router: Router = Router();

// const controllers = require("../../v1/controllers/task.controller");

router.get("/", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);
  res.json(tasks);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const task = await Task.findOne({ _id: id, deleted: false });
  console.log(task);
  res.json(task);
});

export const taskRoutes: Router = router;
