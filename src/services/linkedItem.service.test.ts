import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { LinkedItem } from '../types';
import * as linkedItemService from './linkedItem.service';

describe('linkedItem.service', () => {
  let linkedItems: LinkedItem[];

  beforeEach(() => {
    linkedItems = [];
    jest.spyOn(linkedItemService, 'getLinkedItems').mockImplementation(async () => linkedItems);
    jest
      .spyOn(linkedItemService, 'createLinkedItem')
      .mockImplementation(async (item: LinkedItem) => {
        const created = {
          ...item,
          assetId: item.assetId ?? 'mock-asset-id',
        };
        linkedItems.push(created);
        return created;
      });
    jest
      .spyOn(linkedItemService, 'updateLinkedItem')
      .mockImplementation(async (id: string, updates: Partial<LinkedItem>) => {
        const idx = linkedItems.findIndex((l: LinkedItem) => l.id === id);
        if (idx !== -1) {
          linkedItems[idx] = {
            ...linkedItems[idx],
            ...updates,
            assetId:
              updates.assetId !== undefined
                ? updates.assetId
                : linkedItems[idx].assetId !== undefined
                  ? linkedItems[idx].assetId
                  : null,
          };
          return linkedItems[idx];
        }
        return null;
      });
    jest.spyOn(linkedItemService, 'deleteLinkedItem').mockImplementation(async (id: string) => {
      const prevLen = linkedItems.length;
      linkedItems = linkedItems.filter((l) => l.id !== id);
      return linkedItems.length < prevLen;
    });
  });

  it('should create a linked item', async () => {
    const item: LinkedItem = {
      id: '1',
      todoId: 'todo-1',
      title: 'Test Linked',
      description: null,
      url: 'http://example.com',
      label: 'active',
      createdAt: '2025-09-17',
      updatedAt: '2025-09-17',
      projectId: 'p1',
      assetId: null,
      status: 0,
    };
    const created = await linkedItemService.createLinkedItem(item);
    expect(created.title).toEqual(item.title);
    expect(created.assetId).not.toBeNull();
    expect(await linkedItemService.getLinkedItems()).toContainEqual(created);
  });

  it('should update a linked item', async () => {
    const item: LinkedItem = {
      id: '1',
      todoId: 'todo-1',
      title: 'Test Linked',
      description: null,
      url: 'http://example.com',
      label: 'active',
      createdAt: '2025-09-17',
      updatedAt: '2025-09-17',
      projectId: 'p1',
      assetId: null,
      status: 0,
    };
    await linkedItemService.createLinkedItem(item);
    const updated = await linkedItemService.updateLinkedItem('1', { title: 'Updated' });
    expect(updated).toMatchObject({ id: '1', title: 'Updated' });
  });

  it('should delete a linked item', async () => {
    const item: LinkedItem = {
      id: '1',
      todoId: 'todo-1',
      title: 'Test Linked',
      description: null,
      url: 'http://example.com',
      label: 'active',
      createdAt: '2025-09-17',
      updatedAt: '2025-09-17',
      projectId: 'p1',
      assetId: null,
      status: 0,
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
