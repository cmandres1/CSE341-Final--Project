const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllSuppliers = async (req, res) => {
  //#swagger.tags = ['Suppliers']
  try {
    const result = await mongodb.getDatabase().db().collection('suppliers').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve suppliers', error: error.message });
  }
};

const getSingleSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers']
  try {
    const supplierId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('suppliers').find({ _id: supplierId }).toArray();

    if (result.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve supplier', error: error.message });
  }
};

const createSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers']
  try {
    const { name, contactPerson, phone, email, address, country, company, rating } = req.body;

    if (!name || !contactPerson || !phone || !email || !address || !country || !company || !rating) {
      return res.status(400).json({ message: 'Missing required fields for creating a supplier.' });
    }

    const supplier = { name, contactPerson, phone, email, address, country, company, rating };
    const response = await mongodb.getDatabase().db().collection('suppliers').insertOne(supplier);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Supplier created successfully', supplierId: response.insertedId });
    } else {
      res.status(500).json({ message: 'Some error occurred while inserting the supplier' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create supplier', error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers']
  try {
    const supplierId = new ObjectId(req.params.id);
    const { name, contactPerson, phone, email, address, country, company, rating } = req.body;

    if (!name || !contactPerson || !phone || !email || !address || !country || !company || !rating) {
      return res.status(400).json({ message: 'Missing required fields for updating a supplier.' });
    }

    const supplier = { name, contactPerson, phone, email, address, country, company, rating };
    const response = await mongodb.getDatabase().db().collection('suppliers').replaceOne({ _id: supplierId }, supplier);

    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Supplier not found or no changes were made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update supplier', error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  //#swagger.tags = ['Suppliers']
  try {
    const supplierId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('suppliers').deleteOne({ _id: supplierId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete supplier', error: error.message });
  }
};

module.exports = {
  getAllSuppliers,
  getSingleSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier
};