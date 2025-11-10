import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const client = createClient({ url: redisUrl });

client.on('error', err => console.error('❌ Redis Error:', err));
client.on('connect', () => console.log('✅ Redis connected'));

(async () => {
  if (!client.isOpen) await client.connect();
})();

export default client;
