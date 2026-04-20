import { Request, Response } from "express";
import Task from "../models/task.model";

export const index = async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  console.log(tasks);
  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const task = await Task.findOne({ _id: id, deleted: false });
  console.log(task);
  res.json(task);
};
