import { Request, Response } from "express";
import Task from "../models/task.model";

export const index = async (req: Request, res: Response) => {
    const find: { deleted: boolean; status?: string } = {
      deleted: false,
    };
  // filter
  if (req.query.status) {
    find.status = req.query.status as string;
  }
  // end filter
  const tasks = await Task.find(find);
  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const task = await Task.findOne({ _id: id, deleted: false });

  res.json(task);
};
