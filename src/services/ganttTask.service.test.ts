import { describe, it, expect, beforeEach } from '@jest/globals';
import * as ganttTaskService from './ganttTask.service';

describe('ganttTask.service', () => {
  beforeEach(() => {
    // @ts-ignore
    ganttTaskService['ganttTasks'] = [];
  });

  it('should create a gantt task', () => {
    const task = { id: '1', name: 'Task 1' };
    const created = ganttTaskService.createGanttTask(task);
    expect(created).toEqual(task);
    expect(ganttTaskService.getGanttTasks()).toContainEqual(task);
  });

  it('should update a gantt task', () => {
    const task = { id: '1', name: 'Task 1' };
    ganttTaskService.createGanttTask(task);
    const updated = ganttTaskService.updateGanttTask('1', { name: 'Updated Task' });
    expect(updated).toMatchObject({ id: '1', name: 'Updated Task' });
  });

  it('should delete a gantt task', () => {
    const task = { id: '1', name: 'Task 1' };
    ganttTaskService.createGanttTask(task);
    const deleted = ganttTaskService.deleteGanttTask('1');
    expect(deleted).toBe(true);
    expect(ganttTaskService.getGanttTasks()).toHaveLength(0);
  });

  it('should return null when updating non-existent gantt task', () => {
    const updated = ganttTaskService.updateGanttTask('not-exist', { name: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent gantt task', () => {
    const deleted = ganttTaskService.deleteGanttTask('not-exist');
    expect(deleted).toBe(false);
  });
});
