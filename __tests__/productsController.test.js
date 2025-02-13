const request = require('supertest');
const express = require('express');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const productsController = require('../controllers/products');

const app = express();
app.use(express.json());
app.get('/products', productsController.getAllProducts);
app.get('/products/:id', productsController.getSingleProduct);

jest.mock('../data/database', () => ({
  getDatabase: jest.fn(),
}));

describe('Products Controller', () => {
  test('GET All /products should return a list of products', async () => {
    const mockProducts = [{ _id: new ObjectId(), name: 'Laptop', price: 1200 }];
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => mockProducts,
          }),
        }),
      }),
    });

    const res = await request(app).get('/products');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      mockProducts.map(product => ({ ...product, _id: product._id.toString() }))
    );
  });

  test('GET Single /products/:id should return a single product', async () => {
    const productId = new ObjectId();
    const mockProduct = { _id: productId, name: 'Smartphone', price: 800 };
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [mockProduct],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/products/${productId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...mockProduct, _id: mockProduct._id.toString() });
  });

  test('GET /products/:id should return 404 if product not found', async () => {
    const productId = new ObjectId();
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/products/${productId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product not found' });
  });

  test('GET /products should return 500 on database error', async () => {
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => { throw new Error('Database error'); },
          }),
        }),
      }),
    });

    const res = await request(app).get('/products');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to retrieve products', error: 'Database error' });
  });
});