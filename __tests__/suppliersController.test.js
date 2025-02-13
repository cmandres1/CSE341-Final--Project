const request = require('supertest');
const express = require('express');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const suppliersController = require('../controllers/suppliers');

const app = express();
app.use(express.json());
app.get('/suppliers', suppliersController.getAllSuppliers);
app.get('/suppliers/:id', suppliersController.getSingleSupplier);

jest.mock('../data/database', () => ({
  getDatabase: jest.fn(),
}));

describe('Suppliers Controller', () => {
  test('GET All  /suppliers should return a list of suppliers', async () => {
    const mockSuppliers = [{ _id: new ObjectId(), name: 'ABC Supplies' }];
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => mockSuppliers,
          }),
        }),
      }),
    });

    const res = await request(app).get('/suppliers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      mockSuppliers.map(supplier => ({ ...supplier, _id: supplier._id.toString() }))
    );
  });

  test('GET Single /suppliers/:id should return a single supplier', async () => {
    const supplierId = new ObjectId();
    const mockSupplier = { _id: supplierId, name: 'XYZ Distributors' };
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [mockSupplier],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/suppliers/${supplierId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...mockSupplier, _id: mockSupplier._id.toString() });
  });

  test('GET /suppliers/:id should return 404 if supplier not found', async () => {
    const supplierId = new ObjectId();
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/suppliers/${supplierId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Supplier not found' });
  });

  test('GET /suppliers should return 500 on database error', async () => {
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => { throw new Error('Database error'); },
          }),
        }),
      }),
    });

    const res = await request(app).get('/suppliers');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to retrieve suppliers', error: 'Database error' });
  });
});