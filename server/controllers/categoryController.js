const Category = require('../models/Category');
const responseHandler = require('../utils/responseHandler');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    responseHandler(res, 200, 'Categories retrieved successfully', categories);
  } catch (err) {
    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error(`Category not found with id of ${req.params.id}`);
    }

    responseHandler(res, 200, 'Category retrieved successfully', category);
  } catch (err) {
    next(err);
  }
};


exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    responseHandler(res, 201, 'Category created successfully', category);
  } catch (err) {
    next(err);
  }
};


exports.updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error(`Category not found with id of ${req.params.id}`);
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    responseHandler(res, 200, 'Category updated successfully', category);
  } catch (err) {
    next(err);
  }
};


exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error(`Category not found with id of ${req.params.id}`);
    }

    await category.deleteOne();

    responseHandler(res, 200, 'Category deleted successfully', {});
  } catch (err) {
    next(err);
  }
};
