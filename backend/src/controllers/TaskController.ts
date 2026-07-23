import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/TaskService';

export class TaskController {
  static async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const task = await TaskService.createTask(userId, req.body);
      res.status(201).json({ success: true, task });
    } catch (error) {
      next(error);
    }
  }

  static async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const tasks = await TaskService.getTasks(userId, req.query);
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      next(error);
    }
  }

  static async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const id = req.params.id as string;
      const task = await TaskService.getTaskById(userId, id);
      res.status(200).json({ success: true, task });
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ success: false, message: error.message });
      else next(error);
    }
  }

  static async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const id = req.params.id as string;
      const task = await TaskService.updateTask(userId, id, req.body);
      res.status(200).json({ success: true, task });
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ success: false, message: error.message });
      else next(error);
    }
  }

  static async toggleTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const id = req.params.id as string;
      const task = await TaskService.toggleTaskStatus(userId, id);
      res.status(200).json({ success: true, task });
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ success: false, message: error.message });
      else next(error);
    }
  }

  static async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const id = req.params.id as string;
      await TaskService.deleteTask(userId, id);
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error: any) {
      if (error.status) res.status(error.status).json({ success: false, message: error.message });
      else next(error);
    }
  }
}
