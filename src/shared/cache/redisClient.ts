/**
 * Redis Client Configuration for Caching and Session Storage
 */
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  database: parseInt(process.env.REDIS_DB || '0'),
  
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    connectTimeout: 10000,
    keepAlive: true,
  }
});

// Event handlers for monitoring
redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis with authentication');
});

redisClient.on('reconnecting', () => {
  console.log('Redis client reconnecting...');
});

redisClient.on('ready', () => {
  console.log('Redis client ready for operations');
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection established successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

export default redisClient;