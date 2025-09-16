import { describe, it, expect, beforeEach } from '@jest/globals';
import * as linkedItemService from './linkedItem.service';

describe('linkedItem.service', () => {
  beforeEach(() => {
    // @ts-ignore
    linkedItemService['linkedItems'] = [];
  });

  it('should create a linked item', () => {
    const item = { id: '1', name: 'Item 1' };
    const created = linkedItemService.createLinkedItem(item);
    expect(created).toEqual(item);
    expect(linkedItemService.getLinkedItems()).toContainEqual(item);
  });

  it('should update a linked item', () => {
    const item = { id: '1', name: 'Item 1' };
    linkedItemService.createLinkedItem(item);
    const updated = linkedItemService.updateLinkedItem('1', { name: 'Updated Item' });
    expect(updated).toMatchObject({ id: '1', name: 'Updated Item' });
  });

  it('should delete a linked item', () => {
    const item = { id: '1', name: 'Item 1' };
    linkedItemService.createLinkedItem(item);
    const deleted = linkedItemService.deleteLinkedItem('1');
    expect(deleted).toBe(true);
    expect(linkedItemService.getLinkedItems()).toHaveLength(0);
  });

  it('should return null when updating non-existent linked item', () => {
    const updated = linkedItemService.updateLinkedItem('not-exist', { name: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent linked item', () => {
    const deleted = linkedItemService.deleteLinkedItem('not-exist');
    expect(deleted).toBe(false);
  });
});
