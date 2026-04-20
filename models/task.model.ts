import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
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
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    listUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    taskParentId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  },
  {
    timestamps: true,
  },
);
const Task = mongoose.model("Task", taskSchema, "tasks");

export default Task;
