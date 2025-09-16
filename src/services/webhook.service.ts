type Webhook = { id: string; [key: string]: unknown };
let webhooks: Webhook[] = [];

export const getWebhooks = () => webhooks;
export const createWebhook = (webhook: Webhook) => {
  webhooks.push(webhook);
  return webhook;
};
export const updateWebhook = (id: string, updates: Partial<Webhook>) => {
  const idx = webhooks.findIndex((w) => w.id === id);
  if (idx !== -1) {
    webhooks[idx] = { ...webhooks[idx], ...updates };
    return webhooks[idx];
  }
  return null;
};
export const deleteWebhook = (id: string) => {
  const prevLen = webhooks.length;
  webhooks = webhooks.filter((w) => w.id !== id);
  return webhooks.length < prevLen;
};
