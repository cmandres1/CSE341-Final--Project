const request = require('supertest');
const express = require('express');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const ordersController = require('../controllers/orders');

const app = express();
app.use(express.json());
app.get('/orders', ordersController.getAllOrders);
app.get('/orders/:id', ordersController.getSingleOrder);

jest.mock('../data/database', () => ({
  getDatabase: jest.fn(),
}));

describe('Orders Controller', () => {
  test('GET All /orders should return a list of orders', async () => {
    const mockOrders = [{ _id: new ObjectId(), customerId: '123', totalAmount: 100, status: 'Pending' }];
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => mockOrders,
          }),
        }),
      }),
    });

    const res = await request(app).get('/orders');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      mockOrders.map(order => ({ ...order, _id: order._id.toString() }))
    );
  });

  test('GET Single /orders/:id should return a single order', async () => {
    const orderId = new ObjectId();
    const mockOrder = { _id: orderId, customerId: '123', totalAmount: 200, status: 'Shipped' };
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [mockOrder],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/orders/${orderId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...mockOrder, _id: mockOrder._id.toString() });
  });

  test('GET /orders/:id should return 404 if order not found', async () => {
    const orderId = new ObjectId();
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/orders/${orderId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Order not found' });
  });

  test('GET /orders should return 500 on database error', async () => {
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => { throw new Error('Database error'); },
          }),
        }),
      }),
    });

    const res = await request(app).get('/orders');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to retrieve orders', error: 'Database error' });
  });
});