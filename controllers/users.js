const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const result = await mongodb.getDatabase().db().collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};

const getSingleUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('users').find({ _id: userId }).toArray();

    if (result.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error: error.message });
  }
};

const createUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields for creating a user.' });
    }

    const user = { username, email, password, role };
    const response = await mongodb.getDatabase().db().collection('users').insertOne(user);

    if (response.acknowledged) {
      res.status(201).json({ message: 'User created successfully', userId: response.insertedId });
    } else {
      res.status(500).json({ message: 'Some error occurred while inserting the user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

const updateUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields for updating a user.' });
    }

    const user = { username, email, password, role };
    const response = await mongodb.getDatabase().db().collection('users').replaceOne({ _id: userId }, user);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found or no changes were made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  //#swagger.tags = ['Users']
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
};