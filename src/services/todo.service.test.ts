import { describe, it, expect, beforeEach } from '@jest/globals';
import * as todoService from './todo.service';

describe('todo.service', () => {
  beforeEach(() => {
    // @ts-ignore
    todoService['todos'] = [];
  });

  it('should create a todo', () => {
    const todo = { id: '1', title: 'Test Todo' };
    const created = todoService.createTodo(todo);
    expect(created).toEqual(todo);
    expect(todoService.getTodos()).toContainEqual(todo);
  });

  it('should update a todo', () => {
    const todo = { id: '1', title: 'Test Todo' };
    todoService.createTodo(todo);
    const updated = todoService.updateTodo('1', { title: 'Updated Todo' });
    expect(updated).toMatchObject({ id: '1', title: 'Updated Todo' });
  });

  it('should delete a todo', () => {
    const todo = { id: '1', title: 'Test Todo' };
    todoService.createTodo(todo);
    const deleted = todoService.deleteTodo('1');
    expect(deleted).toBe(true);
    expect(todoService.getTodos()).toHaveLength(0);
  });

  it('should return null when updating non-existent todo', () => {
    const updated = todoService.updateTodo('not-exist', { title: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent todo', () => {
    const deleted = todoService.deleteTodo('not-exist');
    expect(deleted).toBe(false);
  });
});
