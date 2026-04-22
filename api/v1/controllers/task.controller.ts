import { Request, Response } from "express";
import Task from "../models/task.model";

import paginationHelper from "../../../helper/pagination";
import searchHelper from "../../../helper/search";

// [GET]  /tasks
export const index = async (req: Request, res: Response) => {
  interface Find {
    deleted: boolean;
    status?: string;
    title?: RegExp;
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

  //search
  const objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  //end search

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip || 0);
  res.json(tasks);
};

// [GET]  /tasks/detail/:id
export const detail = async (req: Request, res: Response) => {
  const id: string = req.params.id as string;
  const task = await Task.findOne({ _id: id, deleted: false });

  res.json(task);
};

// [PATCH]  /tasks/change-status/:id
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id as string;
    const status: string = req.body.status as string;
    await Task.updateOne({ _id: id }, { status: status });
    res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Không tồn tại!" });
  }
};

// [PATCH]  /tasks/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const ids: string[] = req.body.ids as string[];
    const key: string = req.body.key as string;
    const value: string = req.body.value as string;

    switch (key) {
      case "status":
        await Task.updateMany({ _id: { $in: ids } }, { status: value });
        res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
        break;

      case "delete":
        const deletedAt = new Date();
        await Task.updateMany(
          { _id: { $in: ids } },
          { deleted: true, deletedAt }
        );
        res.json({ code: 200, message: "Xóa thành công" });
        break;

      default:
        res.status(400).json({ code: 400, message: "Không tồn tại!" });
        break;
    }
  } catch (error) {
    res.status(400).json({ code: 400, message: "Không tồn tại!" });
  }
};

// [POST]  /tasks/create
export const create = async (req: Request, res: Response) => {
  try {
    // req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();
    res
      .status(201)
      .json({ code: 201, message: "Tạo mới thành công", data: data });
  } catch (error) {
    res.status(400).json({ code: 400, message: "Lỗi!" });
  }
};