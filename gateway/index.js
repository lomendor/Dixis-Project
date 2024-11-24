import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import { createClient } from 'redis';

const app = express();
const redis = createClient({ url: process.env.REDIS_URL });

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting with Redis
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  store: {
    incr: async (key) => {
      const result = await redis.incr(key);
      await redis.expire(key, 15 * 60);
      return result;
    },
    decr: (key) => redis.decr(key),
    resetKey: (key) => redis.del(key),
  },
});

app.use(limiter);

// Service routes
const services = {
  auth: 'http://auth-service:5001',
  products: 'http://product-service:5002',
  orders: 'http://order-service:5003',
  shipping: 'http://shipping-service:5004',
};

Object.entries(services).forEach(([path, target]) => {
  app.use(
    `/${path}`,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^/${path}`]: '' },
    })
  );
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Readiness check
app.get('/ready', async (req, res) => {
  try {
    await redis.ping();
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});