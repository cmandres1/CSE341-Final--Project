const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllProducts = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const result = await mongodb.getDatabase().db().collection('products').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve products', error: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('products').find({ _id: productId }).toArray();

    if (result.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve product', error: error.message });
  }
};

const createProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const { name, description, price, category, stock, brand, sku, weight } = req.body;

    if (!name || !description || !price || !category || !stock || !brand || !sku || !weight) {
      return res.status(400).json({ message: 'Missing required fields for creating a product.' });
    }

    const product = { name, description, price, category, stock, brand, sku, weight };
    const response = await mongodb.getDatabase().db().collection('products').insertOne(product);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Product created successfully', productId: response.insertedId });
    } else {
      res.status(500).json({ message: 'Some error occurred while inserting the product' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const { name, description, price, category, stock, brand, sku, weight } = req.body;

    if (!name || !description || !price || !category || !stock || !brand || !sku || !weight) {
      return res.status(400).json({ message: 'Missing required fields for updating a product.' });
    }

    const product = { name, description, price, category, stock, brand, sku, weight };
    const response = await mongodb.getDatabase().db().collection('products').replaceOne({ _id: productId }, product);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product not found or no changes were made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('products').deleteOne({ _id: productId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
