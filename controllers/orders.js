const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllOrders = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const result = await mongodb.getDatabase().db().collection('orders').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
};

const getSingleOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const orderId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('orders').find({ _id: orderId }).toArray();

    if (result.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve order', error: error.message });
  }
};

const createOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const { customerId, products, totalAmount, status } = req.body;

    if (!customerId || !products || !totalAmount || !status) {
      return res.status(400).json({ message: 'Missing required fields for creating an order.' });
    }

    const order = { customerId, products, totalAmount, status, createdAt: new Date() };
    const response = await mongodb.getDatabase().db().collection('orders').insertOne(order);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Order created successfully', orderId: response.insertedId });
    } else {
      res.status(500).json({ message: 'Some error occurred while inserting the order' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

const updateOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const orderId = new ObjectId(req.params.id);
    const { customerId, products, totalAmount, status } = req.body;

    if (!customerId || !products || !totalAmount || !status) {
      return res.status(400).json({ message: 'Missing required fields for updating an order.' });
    }

    const order = { customerId, products, totalAmount, status, updatedAt: new Date() };
    const response = await mongodb.getDatabase().db().collection('orders').replaceOne({ _id: orderId }, order);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found or no changes were made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const orderId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('orders').deleteOne({ _id: orderId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder
};