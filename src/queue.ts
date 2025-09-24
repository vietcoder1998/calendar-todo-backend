import amqp from 'amqplib';
import { RABBITMQ_URL, QUEUE_NAME } from './env';
let channel: amqp.Channel | null = null;

export async function connectQueue() {
  const conn = await amqp.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: false });
}

export async function publishNotificationEvent(event: any) {
  if (!channel) await connectQueue();
  channel!.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(event)));
}
