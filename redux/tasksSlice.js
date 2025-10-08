import { createSlice } from "@reduxjs/toolkit";

const priorityOrder = { Cao: 3, "Trung bình": 2, Thấp: 1 };

const sortItems = (items) =>
  items.sort(
    (a, b) =>
      (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
  );

const initialState = {
  items: [
    {
      id: "1",
      title: "TASK 01",
      priority: "Cao",
      deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
      done: false,
    },
    {
      id: "2",
      title: "TASK 02",
      priority: "Trung bình",
      deadline: new Date(Date.now() + 2 * 86400000).toISOString(),
      done: false,
    },
  ],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items.push(action.payload);
      sortItems(state.items);
    },
    updateTask: (state, action) => {
      const { id, changes } = action.payload;
      const idx = state.items.findIndex((t) => t.id === id);
      if (idx !== -1) {
        state.items[idx] = { ...state.items[idx], ...changes };
        sortItems(state.items);
      }
    },
    toggleTaskDone: (state, action) => {
      const id = action.payload;
      const t = state.items.find((it) => it.id === id);
      if (t) t.done = !t.done;
    },
    deleteTask: (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setTasks: (state, action) => {
      state.items = action.payload;
      sortItems(state.items);
    },
  },
});

export const { addTask, updateTask, toggleTaskDone, deleteTask, setTasks } =
  tasksSlice.actions;
export default tasksSlice.reducer;
