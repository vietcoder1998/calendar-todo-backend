import { getWebhooks } from './webhook.service';

describe('webhook.service', () => {
  it('should get webhooks (empty array if none)', async () => {
    const result = await getWebhooks();
    expect(Array.isArray(result)).toBe(true);
  });
});
