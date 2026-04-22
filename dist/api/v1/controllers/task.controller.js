"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.edit = exports.create = exports.changeMulti = exports.changeStatus = exports.detail = exports.index = void 0;
const task_model_1 = __importDefault(require("../models/task.model"));
const pagination_1 = __importDefault(require("../../../helper/pagination"));
const search_1 = __importDefault(require("../../../helper/search"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const find = {
        deleted: false,
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    let sort = {};
    const allowedSortKeys = ["createdAt", "timeFinish", "timeStart", "title"];
    const allowedSortValues = ["asc", "desc"];
    if (req.query.sortKey && req.query.sortValue) {
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        if (allowedSortKeys.includes(sortKey) &&
            allowedSortValues.includes(sortValue)) {
            sort = {
                [sortKey]: sortValue,
            };
        }
    }
    let initialPagination = {
        currentPage: 1,
        limitItems: 2,
    };
    const countTasks = yield task_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)(initialPagination, req.query, countTasks);
    const objectSearch = (0, search_1.default)(req.query);
    if (req.query.keyword) {
        find.title = objectSearch.regex;
    }
    const tasks = yield task_model_1.default.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip || 0);
    res.json(tasks);
});
exports.index = index;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const task = yield task_model_1.default.findOne({ _id: id, deleted: false });
    res.json(task);
});
exports.detail = detail;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const status = req.body.status;
        yield task_model_1.default.updateOne({ _id: id }, { status: status });
        res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
    }
    catch (error) {
        res.status(400).json({ code: 400, message: "Không tồn tại!" });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids;
        const key = req.body.key;
        const value = req.body.value;
        switch (key) {
            case "status":
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { status: value });
                res.json({ code: 200, message: "Cập nhật trạng thái thành công" });
                break;
            case "delete":
                const deletedAt = new Date();
                yield task_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt });
                res.json({ code: 200, message: "Xóa thành công" });
                break;
            default:
                res.status(400).json({ code: 400, message: "Không tồn tại!" });
                break;
        }
    }
    catch (error) {
        res.status(400).json({ code: 400, message: "Không tồn tại!" });
    }
});
exports.changeMulti = changeMulti;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_model_1.default(req.body);
        const data = yield task.save();
        res
            .status(201)
            .json({ code: 201, message: "Tạo mới thành công", data: data });
    }
    catch (error) {
        res.status(400).json({ code: 400, message: "Lỗi!" });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updates = req.body;
        const task = yield task_model_1.default.findByIdAndUpdate(id, updates);
        if (!task) {
            return res.status(404).json({ code: 404, message: "Task not found" });
        }
        res.json({ code: 200, message: "Cập nhật task thành công" });
    }
    catch (error) {
        res.status(400).json({ code: 400, message: "Lỗi!" });
    }
});
exports.edit = edit;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const task = yield task_model_1.default.findByIdAndUpdate(id, {
            deleted: true,
            deletedAt: new Date(),
        });
        if (!task) {
            return res.status(404).json({ code: 404, message: "Task not found" });
        }
        res.json({ code: 200, message: "Xóa task thành công" });
    }
    catch (error) {
        res.status(400).json({ code: 400, message: "Lỗi!" });
    }
});
exports.deleteTask = deleteTask;
