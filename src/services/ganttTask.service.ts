type GanttTask = { id: string; [key: string]: unknown };
let ganttTasks: GanttTask[] = [];

export const getGanttTasks = () => ganttTasks;

export const getGanttTasksByProjectId = (projectId: string) => {
  return ganttTasks.filter((t) => t.projectId === projectId);
};
export const createGanttTask = (task: GanttTask) => {
  ganttTasks.push(task);
  return task;
};
export const updateGanttTask = (id: string, updates: Partial<GanttTask>) => {
  const idx = ganttTasks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    ganttTasks[idx] = { ...ganttTasks[idx], ...updates };
    return ganttTasks[idx];
  }
  return null;
};
export const deleteGanttTask = (id: string) => {
  const prevLen = ganttTasks.length;
  ganttTasks = ganttTasks.filter((t) => t.id !== id);
  return ganttTasks.length < prevLen;
};
