import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import * as webhookService from './webhook.service';
import { Webhook } from '../types';

describe('webhook.service', () => {
  let webhooks: Webhook[];

  beforeEach(() => {
    webhooks = [];
    jest.spyOn(webhookService, 'getWebhooks').mockImplementation(async () => webhooks);
    jest.spyOn(webhookService, 'createWebhook').mockImplementation(async (webhook: Webhook) => {
      webhooks.push(webhook);
      return webhook;
    });
    jest
      .spyOn(webhookService, 'updateWebhook')
      .mockImplementation(async (id: string, updates: Partial<Webhook>) => {
        const idx = webhooks.findIndex((w: Webhook) => w.id === id);
        if (idx !== -1) {
          webhooks[idx] = { ...webhooks[idx], ...updates };
          return webhooks[idx];
        }
        return null;
      });
    jest.spyOn(webhookService, 'deleteWebhook').mockImplementation(async (id: string) => {
      const prevLen = webhooks.length;
      webhooks = webhooks.filter((w: Webhook) => w.id !== id);
      return webhooks.length < prevLen;
    });
  });

  it('should create a webhook', async () => {
    const webhook: Webhook = {
      id: '1',
      name: 'Webhook 1',
      platform: 'telegram',
      token: null,
      chatId: null,
      webhookUrl: null,
      enabled: true,
      projectId: 'project-1',
    };
    const created = await webhookService.createWebhook(webhook);
    expect(created).toEqual(webhook);
    expect(await webhookService.getWebhooks()).toContainEqual(webhook);
  });

  it('should update a webhook', async () => {
    const webhook: Webhook = {
      id: '1',
      name: 'Webhook 1',
      platform: 'telegram',
      token: null,
      chatId: null,
      webhookUrl: null,
      enabled: true,
      projectId: 'project-1',
    };
    await webhookService.createWebhook(webhook);
    const updated = await webhookService.updateWebhook('1', { name: 'Updated Webhook' });
    expect(updated).toMatchObject({ id: '1', name: 'Updated Webhook' });
  });

  it('should delete a webhook', async () => {
    const webhook: Webhook = {
      id: '1',
      name: 'Webhook 1',
      platform: 'telegram',
      token: null,
      chatId: null,
      webhookUrl: null,
      enabled: true,
      projectId: 'project-1',
    };
    await webhookService.createWebhook(webhook);
    const deleted = await webhookService.deleteWebhook('1');
    expect(deleted).toBe(true);
    expect(await webhookService.getWebhooks()).toHaveLength(0);
  });

  it('should return null when updating non-existent webhook', async () => {
    const updated = await webhookService.updateWebhook('not-exist', { name: 'fail' });
    expect(updated).toBeNull();
  });

  it('should return false when deleting non-existent webhook', async () => {
    const deleted = await webhookService.deleteWebhook('not-exist');
    expect(deleted).toBe(false);
  });
});
