const validator = require('../helpers/validate');

// User validation
const validateUser = (req, res, next) => {
  const validationRule = {
    username: 'required|string',
    email: 'required|email',
    password: 'required|string|min:6',
    role: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'User validation failed',
        data: err
      });
    }
    next();
  });
};

// Product validation
const validateProduct = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    description: 'required|string',
    price: 'required|numeric',
    category: 'required|string',
    stock: 'required|numeric',
    brand: 'required|string',
    sku: 'required|string',
    weight: 'required|numeric'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Product validation failed',
        data: err
      });
    }
    next();
  });
};

// Supplier validation
const validateSupplier = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    contactPerson: 'required|string',
    phone: 'required|string',
    email: 'required|email',
    address: 'required|string',
    country: 'required|string',
    company: 'required|string',
    rating: 'required|numeric|min:1|max:5'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Supplier validation failed',
        data: err
      });
    }
    next();
  });
};

// Order validation
const validateOrder = (req, res, next) => {
  const validationRule = {
    customerId: 'required|string',
    products: 'required|array',
    totalAmount: 'required|numeric',
    status: 'required|string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Order validation failed',
        data: err
      });
    }
    next();
  });
};

module.exports = {
  validateUser,
  validateProduct,
  validateSupplier,
  validateOrder
};