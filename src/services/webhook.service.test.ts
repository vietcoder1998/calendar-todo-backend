import { describe, it, expect, beforeEach } from '@jest/globals';
import * as webhookService from './webhook.service';

describe('webhook.service', () => {
  beforeEach(() => {
    // @ts-ignore
    webhookService['webhooks'] = [];
  });

  it('should create a webhook', () => {
    const webhook = { id: '1', name: 'Webhook 1' };
    const created = webhookService.createWebhook(webhook);
    expect(created).toEqual(webhook);
    expect(webhookService.getWebhooks()).toContainEqual(webhook);
  });

  it('should update a webhook', () => {
    const webhook = { id: '1', name: 'Webhook 1' };
    webhookService.createWebhook(webhook);
    const updated = webhookService.updateWebhook('1', { name: 'Updated Webhook' });
    expect(updated).toMatchObject({ id: '1', name: 'Updated Webhook' });
  });

  it('should delete a webhook', () => {
    const webhook = { id: '1', name: 'Webhook 1' };
    webhookService.createWebhook(webhook);
    const deleted = webhookService.deleteWebhook('1');
    expect(deleted).toBe(true);
    expect(webhookService.getWebhooks()).toHaveLength(0);
  });

  it('should return null when updating non-existent webhook', () => {
    const updated = webhookService.updateWebhook('not-exist', { name: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent webhook', () => {
    const deleted = webhookService.deleteWebhook('not-exist');
    expect(deleted).toBe(false);
  });
});
