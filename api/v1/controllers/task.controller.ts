import { Request, Response } from "express";
import Task from "../models/task.model";

import paginationHelper from "../../../helper/pagination";

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

  // pagination
  interface PaginationObject {
    currentPage: number;
    limitItems: number;
    skip?: number;
    totalPage?: number;
  }
  let initialPagination: PaginationObject = {
    currentPage: 1,
    limitItems: 2,
  };
  const countTasks: number = await Task.countDocuments(find);
  let objectPagination: PaginationObject = paginationHelper(
    initialPagination,
    req.query,
    countTasks,
  );
  // end pagination

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip || 0);
  res.json(tasks);
};

export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const task = await Task.findOne({ _id: id, deleted: false });

  res.json(task);
};
