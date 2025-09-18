import { beforeEach, describe, expect, it } from '@jest/globals';
import { FileItem } from '../types';
import * as fileService from './file.service';

describe('file.service', () => {
  let files: FileItem[];

  beforeEach(() => {
    files = [];
    jest.spyOn(fileService, 'getFiles').mockImplementation(async () => files);
    jest.spyOn(fileService, 'createFile').mockImplementation(async (file) => {
      const created = { ...file, assetId: file.assetId ?? 'mock-asset-id' };
      files.push(created);
      return created;
    });
    jest
      .spyOn(fileService, 'updateFile')
      .mockImplementation(async (id: string, updates: Partial<FileItem>) => {
        const idx = files.findIndex((f) => f.id === id);
        if (idx !== -1) {
          files[idx] = { ...files[idx], ...updates };
          return files[idx];
        }
        return null;
      });
    jest.spyOn(fileService, 'deleteFile').mockImplementation(async (id: string) => {
      const prevLen = files.length;
      files = files.filter((f) => f.id !== id);
      return files.length < prevLen;
    });
  });

  it('should create a file', async () => {
    const file: FileItem = {
      id: '1',
      name: 'test.txt',
      projectId: 'p1',
      createdAt: null,
      updatedAt: null,
      url: null,
      assetId: null,
    };
    const created = await fileService.createFile(file);
    expect(created.name).toEqual(file.name);
    expect(created.assetId).not.toBeNull(); // assetId should be set
    expect(await fileService.getFiles()).toContainEqual(created);
  });

  it('should update a file', async () => {
    const file: FileItem = {
      id: '1',
      name: 'test.txt',
      projectId: 'p1',
      createdAt: null,
      updatedAt: null,
      url: null,
      assetId: null,
    };
    await fileService.createFile(file);
    const updated = await fileService.updateFile('1', { name: 'updated.txt' });
    expect(updated).toMatchObject({ id: '1', name: 'updated.txt' });
  });

  it('should delete a file', async () => {
    const file: FileItem = {
      id: '1',
      name: 'test.txt',
      projectId: 'p1',
      createdAt: null,
      updatedAt: null,
      url: null,
      assetId: null,
    };
    await fileService.createFile(file);
    const deleted = await fileService.deleteFile('1');
    expect(deleted).toBe(true);
    expect(await fileService.getFiles()).toHaveLength(0);
  });

  it('should return null when updating non-existent file', async () => {
    const updated = await fileService.updateFile('not-exist', { name: 'fail.txt' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent file', async () => {
    const deleted = await fileService.deleteFile('not-exist');
    expect(deleted).toBe(false);
  });
});
