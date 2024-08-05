import type { NextApiRequest, NextApiResponse } from "next";
import {
  initializeTasks,
  getActiveTasks,
  getCompletedTasks,
  getAllTasks,
  completeTask,
  createTask,
  updateTask,
  deleteTask,
} from "@/modules/taskManager";
import Task from "@/model/Task";

type Data = Task | Task[] | { message: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  initializeTasks(); 

  switch (req.method) {
    case "GET":
      const { type } = req.query;
      if (type === "active") {
        res.status(200).json(getActiveTasks());
      } else if (type === "completed") {
        res.status(200).json(getCompletedTasks());
      } else {
        res.status(200).json(getAllTasks());
      }
      break;

    case "POST":
      const { title, description, persona, group } = req.body;
      if (title && description && persona && group !== undefined) {
        createTask(title, description, persona, Number(group));
        res.status(201).json({ message: "Task created successfully" });
      } else {
        res.status(400).json({ message: "Missing required fields" });
      }
      break;

    case "PUT":
      const { id, ...updatedTask } = req.body;
      if (id !== undefined) {
        updateTask(Number(id), updatedTask);
        res.status(200).json({ message: "Task updated successfully" });
      } else {
        res.status(400).json({ message: "Missing task ID" });
      }
      break;

    case "DELETE":
      const { id: taskId } = req.query;
      if (taskId !== undefined) {
        deleteTask(Number(taskId));
        res.status(200).json({ message: "Task deleted successfully" });
      } else {
        res.status(400).json({ message: "Missing task ID" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
