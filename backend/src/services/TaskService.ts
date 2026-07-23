import { Task } from '../models/Task';

export class TaskService {
  static async createTask(userId: string, data: any) {
    const task = await Task.create({ ...data, userId });
    return task;
  }

  static async getTasks(userId: string, queryParams: any = {}) {
    const { search, category, priority, completed, sortBy = 'createdAt', order = 'desc' } = queryParams;
    const filter: any = { userId };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (completed !== undefined) filter.completed = completed === 'true';

    const sortConfig: any = {};
    sortConfig[sortBy] = order === 'asc' ? 1 : -1;

    return await Task.find(filter).sort(sortConfig);
  }

  static async getTaskById(userId: string, taskId: string) {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      const error = new Error('Task not found');
      (error as any).status = 404;
      throw error;
    }
    return task;
  }

  static async updateTask(userId: string, taskId: string, data: any) {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error('Task not found');
      (error as any).status = 404;
      throw error;
    }

    return task;
  }

  static async toggleTaskStatus(userId: string, taskId: string) {
    const task = await this.getTaskById(userId, taskId);
    task.completed = !task.completed;
    await task.save();
    return task;
  }

  static async deleteTask(userId: string, taskId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      const error = new Error('Task not found');
      (error as any).status = 404;
      throw error;
    }
    return task;
  }
}
