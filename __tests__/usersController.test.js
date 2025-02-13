const request = require('supertest');
const express = require('express');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');
const usersController = require('../controllers/users');

const app = express();
app.use(express.json());
app.get('/users', usersController.getAllUsers);
app.get('/users/:id', usersController.getSingleUser);

jest.mock('../data/database', () => ({
  getDatabase: jest.fn(),
}));

describe('Users Controller', () => {
  test('GET All /users should return a list of users', async () => {
    const mockUsers = [{ _id: new ObjectId(), name: 'John Doe' }];
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => mockUsers,
          }),
        }),
      }),
    });

    const res = await request(app).get('/users');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      mockUsers.map(user => ({ ...user, _id: user._id.toString() }))
    );
  });

  test('GET Single /users/:id should return a single user', async () => {
    const userId = new ObjectId();
    const mockUser = { _id: userId, name: 'Jane Doe' };
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [mockUser],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...mockUser, _id: mockUser._id.toString() });
  });

  test('GET /users/:id should return 404 if user not found', async () => {
    const userId = new ObjectId();
    
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => [],
          }),
        }),
      }),
    });

    const res = await request(app).get(`/users/${userId}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  test('GET /users should return 500 on database error', async () => {
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({
            toArray: async () => { throw new Error('Database error'); },
          }),
        }),
      }),
    });

    const res = await request(app).get('/users');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Failed to retrieve users', error: 'Database error' });
  });
});