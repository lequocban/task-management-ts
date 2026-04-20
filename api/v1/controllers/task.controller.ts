import { Request, Response } from "express";
import Task from "../models/task.model";

export const index = async (req: Request, res: Response) => {
  interface Find {
    deleted: boolean;
    status?: string;
  }
  const find: Find = {
    deleted: false,
  };
  // filter
  if (req.query.status) {
    find.status = req.query.status as string;
  }
  // end filter

  // sort
  let sort = {};
  const allowedSortKeys = ["createdAt", "timeFinish", "timeStart", "title"];
  const allowedSortValues = ["asc", "desc"];
  if (req.query.sortKey && req.query.sortValue) {
    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as string;
    if (
      allowedSortKeys.includes(sortKey) &&
      allowedSortValues.includes(sortValue)
    ) {
      sort = {
        [sortKey]: sortValue,
      };
    }
  }

  const tasks = await Task.find(find).sort(sort);
  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const task = await Task.findOne({ _id: id, deleted: false });

  res.json(task);
};
