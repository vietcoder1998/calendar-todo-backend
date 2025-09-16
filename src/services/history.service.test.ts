import { describe, it, expect, beforeEach } from '@jest/globals';
import * as historyService from './history.service';

describe('history.service', () => {
  beforeEach(() => {
    // @ts-ignore
    historyService['histories'] = [];
  });

  it('should create a history', () => {
    const history = { id: '1', action: 'create' };
    const created = historyService.createHistory(history);
    expect(created).toEqual(history);
    expect(historyService.getHistories()).toContainEqual(history);
  });

  it('should update a history', () => {
    const history = { id: '1', action: 'create' };
    historyService.createHistory(history);
    const updated = historyService.updateHistory('1', { action: 'update' });
    expect(updated).toMatchObject({ id: '1', action: 'update' });
  });

  it('should delete a history', () => {
    const history = { id: '1', action: 'create' };
    historyService.createHistory(history);
    const deleted = historyService.deleteHistory('1');
    expect(deleted).toBe(true);
    expect(historyService.getHistories()).toHaveLength(0);
  });

  it('should return null when updating non-existent history', () => {
    const updated = historyService.updateHistory('not-exist', { action: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent history', () => {
    const deleted = historyService.deleteHistory('not-exist');
    expect(deleted).toBe(false);
  });
});
