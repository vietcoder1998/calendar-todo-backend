import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LinkedItem } from '../types';
import * as linkedItemService from './linkedItem.service';

describe('linkedItem.service', () => {
  let linkedItems: LinkedItem[];

  beforeEach(() => {
    linkedItems = [];
    jest.spyOn(linkedItemService, 'getLinkedItems').mockImplementation(async () => linkedItems);
    jest.spyOn(linkedItemService, 'createLinkedItem').mockImplementation(async (item: any) => {
      linkedItems.push(item);
      return item;
    });
    jest
      .spyOn(linkedItemService, 'updateLinkedItem')
      .mockImplementation(async (id: string, updates: any) => {
        const idx = linkedItems.findIndex((i) => i.id === id);
        if (idx !== -1) {
          linkedItems[idx] = { ...linkedItems[idx], ...(updates as Partial<LinkedItem>) };
          return linkedItems[idx];
        }
        return null;
      });
    jest.spyOn(linkedItemService, 'deleteLinkedItem').mockImplementation(async (id: string) => {
      const prevLen = linkedItems.length;
      linkedItems = linkedItems.filter((i) => i.id !== id);
      return linkedItems.length < prevLen;
    });
  });

  it('should create a linked item', async () => {
    const item: LinkedItem = {
      id: '1',
      todoId: 'todo-1',
      title: 'Item 1',
      description: 'Description 1',
      url: 'http://example.com',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: 'project-1',
    };
    const created = await linkedItemService.createLinkedItem(item);
    expect(created).toEqual(item);
    expect(await linkedItemService.getLinkedItems()).toContainEqual(item);
  });

  it('should update a linked item', async () => {
    const item: LinkedItem = {
      id: '1',
      todoId: 'todo-1',
      title: 'Item 1',
      description: 'Description 1',
      url: 'http://example.com',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: 'project-1',
    };
    await linkedItemService.createLinkedItem(item);
    const updated = await linkedItemService.updateLinkedItem('1', { title: 'Updated Item' });
    expect(updated).toMatchObject({ id: '1', title: 'Updated Item' });
  });

  it('should delete a linked item', async () => {
    const item: LinkedItem = {
      id: '1',
      todoId: 'todo-1',
      title: 'Item 1',
      description: 'Description 1',
      url: 'http://example.com',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: 'project-1',
    };
    await linkedItemService.createLinkedItem(item);
    const deleted = await linkedItemService.deleteLinkedItem('1');
    expect(deleted).toBe(true);
    expect(await linkedItemService.getLinkedItems()).toHaveLength(0);
  });

  it('should return null when updating non-existent linked item', async () => {
    const updated = await linkedItemService.updateLinkedItem('not-exist', { title: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent linked item', async () => {
    const deleted = await linkedItemService.deleteLinkedItem('not-exist');
    expect(deleted).toBe(false);
  });
});
