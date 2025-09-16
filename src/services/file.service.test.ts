import { describe, it, expect, beforeEach } from '@jest/globals';
import * as fileService from './file.service';

describe('file.service', () => {
  beforeEach(() => {
    // @ts-ignore
    fileService['files'] = [];
  });

  it('should create a file', () => {
    const file = { id: '1', name: 'test.txt' };
    const created = fileService.createFile(file);
    expect(created).toEqual(file);
    expect(fileService.getFiles()).toContainEqual(file);
  });

  it('should update a file', () => {
    const file = { id: '1', name: 'test.txt' };
    fileService.createFile(file);
    const updated = fileService.updateFile('1', { name: 'updated.txt' });
    expect(updated).toMatchObject({ id: '1', name: 'updated.txt' });
  });

  it('should delete a file', () => {
    const file = { id: '1', name: 'test.txt' };
    fileService.createFile(file);
    const deleted = fileService.deleteFile('1');
    expect(deleted).toBe(true);
    expect(fileService.getFiles()).toHaveLength(0);
  });

  it('should return null when updating non-existent file', () => {
    const updated = fileService.updateFile('not-exist', { name: 'fail.txt' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent file', () => {
    const deleted = fileService.deleteFile('not-exist');
    expect(deleted).toBe(false);
  });
});
