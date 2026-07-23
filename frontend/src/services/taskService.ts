import { api } from './api';
import { Task } from '../types';

export interface TaskInput {
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
}

export const taskService = {
  async getTasks(params?: any): Promise<Task[]> {
    const response = await api.get('/tasks', { params });
    return response.data.tasks;
  },

  async getTask(id: string): Promise<Task> {
    const response = await api.get(`/tasks/${id}`);
    return response.data.task;
  },

  async createTask(data: TaskInput): Promise<Task> {
    const response = await api.post('/tasks', data);
    return response.data.task;
  },

  async updateTask(id: string, data: TaskInput): Promise<Task> {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data.task;
  },

  async toggleTask(id: string): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }
};
