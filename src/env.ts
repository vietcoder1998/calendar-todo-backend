require('dotenv').config();

export const PORT = process.env.PORT || 4000;
export const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'test',
};
export const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
export const QUEUE_NAME = process.env.RABBITMQ_QUEUE_NAME || 'notification-events';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
