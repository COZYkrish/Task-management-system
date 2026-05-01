/**
 * Tasks Redux Slice
 * Manages task list state, filters, pagination
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Async Thunks ──────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/tasks', { params });
      return data.data; // { tasks, pagination }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const reorderTasks = createAsyncThunk(
  'tasks/reorder',
  async (tasks, { rejectWithValue }) => {
    try {
      await api.patch('/tasks/reorder', { tasks });
      return tasks;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reorder');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────

const initialState = {
  items: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
  filters: {
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
  selectedTask: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },
    // Real-time WebSocket handlers
    taskCreated: (state, action) => {
      const exists = state.items.find((t) => t.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      }
    },
    taskUpdated: (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
      if (state.selectedTask?.id === action.payload.id) {
        state.selectedTask = action.payload;
      }
    },
    taskDeleted: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload.id);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder.addCase(createTask.fulfilled, (state, action) => {
      // Optimistic update (WebSocket will also fire)
      const exists = state.items.find((t) => t.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    });

    builder.addCase(updateTask.fulfilled, (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    });

    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    });
  },
});

export const {
  setFilter,
  clearFilters,
  setSelectedTask,
  taskCreated,
  taskUpdated,
  taskDeleted,
} = tasksSlice.actions;

// ── Selectors ─────────────────────────────────────────────────
export const selectAllTasks = (state) => state.tasks.items;
export const selectTasksLoading = (state) => state.tasks.isLoading;
export const selectTasksError = (state) => state.tasks.error;
export const selectPagination = (state) => state.tasks.pagination;
export const selectFilters = (state) => state.tasks.filters;
export const selectSelectedTask = (state) => state.tasks.selectedTask;

// Kanban grouped selector
export const selectKanbanColumns = (state) => {
  const tasks = state.tasks.items;
  return {
    TODO: tasks.filter((t) => t.status === 'TODO').sort((a, b) => a.order - b.order),
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').sort((a, b) => a.order - b.order),
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').sort((a, b) => a.order - b.order),
  };
};

export default tasksSlice.reducer;
