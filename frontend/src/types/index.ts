export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  _id: string; // MongoDB ObjectId
  userId: string;
  title: string;
  description?: string;
  dateTime: string;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  category: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Prepare more common interfaces here
