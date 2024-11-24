import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import app from '../index.js';
import Product from '../models/Product.js';
import { createTestUser, getAuthToken } from './helpers.js';

describe('Products API', () => {
  let authToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await createTestUser('producer');
    authToken = getAuthToken(user);
  });

  afterAll(async () => {
    await Product.deleteMany({});
    await mongoose.connection.close();
  });

  it('creates a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        category: 'food',
        stock: 100,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', 'Test Product');
  });

  it('lists all products', async () => {
    const res = await request(app)
      .get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('updates a product', async () => {
    const product = await Product.create({
      name: 'Old Name',
      description: 'Old Description',
      price: 19.99,
      category: 'food',
      stock: 50,
      producer: mongoose.Types.ObjectId(),
    });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'New Name',
        price: 24.99,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', 'New Name');
    expect(res.body).toHaveProperty('price', 24.99);
  });
});