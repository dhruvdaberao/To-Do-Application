import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskService, TaskInput } from '../../services/taskService';
import { Task } from '../../types';
import { showSnackbar } from './uiSlice';

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  selectedPriority: string;
  selectedCompleted: string;
  selectedSortBy: string;
  selectedOrder: 'asc' | 'desc';
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: '',
  selectedPriority: '',
  selectedCompleted: '',
  selectedSortBy: 'createdAt',
  selectedOrder: 'desc',
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (params: any | void, { rejectWithValue, getState }) => {
  try {
    const state: any = getState();
    const { searchTerm, selectedCategory, selectedPriority, selectedCompleted, selectedSortBy, selectedOrder } = state.tasks;
    
    const queryParams: any = {};
    if (searchTerm) queryParams.search = searchTerm;
    if (selectedCategory) queryParams.category = selectedCategory;
    if (selectedPriority) queryParams.priority = selectedPriority;
    if (selectedCompleted !== '') queryParams.completed = selectedCompleted;
    if (selectedSortBy) queryParams.sortBy = selectedSortBy;
    if (selectedOrder) queryParams.order = selectedOrder;

    return await taskService.getTasks(queryParams);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
  }
});

export const fetchTaskById = createAsyncThunk('tasks/fetchTaskById', async (id: string, { rejectWithValue }) => {
  try {
    return await taskService.getTask(id);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
  }
});

export const createTask = createAsyncThunk('tasks/createTask', async (data: TaskInput, { dispatch, rejectWithValue }) => {
  try {
    const task = await taskService.createTask(data);
    dispatch(showSnackbar('Task Created!'));
    return task;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: TaskInput }, { dispatch, rejectWithValue }) => {
    try {
      const task = await taskService.updateTask(id, data);
      dispatch(showSnackbar('Task Updated!'));
      return task;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const toggleTask = createAsyncThunk('tasks/toggleTask', async (id: string, { dispatch, rejectWithValue }) => {
  try {
    const task = await taskService.toggleTask(id);
    dispatch(showSnackbar(task.completed ? 'Task Completed!' : 'Task Marked Incomplete'));
    return task;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle task');
  }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string, { dispatch, rejectWithValue }) => {
  try {
    await taskService.deleteTask(id);
    dispatch(showSnackbar('Task Deleted!'));
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: string, value: any }>) => {
      (state as any)[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedCategory = '';
      state.selectedPriority = '';
      state.selectedCompleted = '';
      state.selectedSortBy = 'createdAt';
      state.selectedOrder = 'desc';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      // Fetch Task By Id
      .addCase(fetchTaskById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      // Create Task
      .addCase(createTask.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.unshift(action.payload); // Add to top
      })
      .addCase(createTask.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      // Update Task
      .addCase(updateTask.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      
      // Toggle Task
      .addCase(toggleTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      
      // Delete Task
      .addCase(deleteTask.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t._id !== action.payload);
        if (state.selectedTask?._id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearTaskError, clearSelectedTask, setSearchTerm, setFilter, clearFilters } = taskSlice.actions;
export default taskSlice.reducer;
