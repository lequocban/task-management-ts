"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: String,
    status: String,
    content: String,
    timeStart: Date,
    timeFinish: Date,
    deleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: Date,
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    listUser: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" }],
    taskParentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Task" },
}, {
    timestamps: true,
});
const Task = mongoose_1.default.model("Task", taskSchema, "tasks");
exports.default = Task;
