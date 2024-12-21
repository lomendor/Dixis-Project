import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Category from '../models/Category';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import {
  GetCategoriesRequest,
  GetCategoryRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryRequest,
  UpdateOrderRequest,
  CategoryTree,
  Category as CategoryType,
  CategoryDocument
} from '../../src/types/controllers/category.types';

// Get all categories with optional parent filter
export const getCategories = async (req: GetCategoriesRequest, res: Response) => {
  try {
    const { parent } = req.query;
    const query = parent ? { parent } : { parent: null };

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .populate('children', 'name')
      .sort('order');

    res.json({
      status: 'success',
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των κατηγοριών' 
    });
  }
};

// Get category by ID
export const getCategory = async (req: GetCategoryRequest, res: Response) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name')
      .populate('children', 'name');

    if (!category) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Η κατηγορία δεν βρέθηκε' 
      });
    }

    res.json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση της κατηγορίας' 
    });
  }
};

// Create new category
export const createCategory = async (req: CreateCategoryRequest, res: Response) => {
  try {
    const categoryData = req.body;

    // Handle image upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      categoryData.image = result.secure_url;
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json({
      status: 'success',
      data: category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ 
      status: 'error',
      message: 'Σφάλμα κατά τη δημιουργία της κατηγορίας' 
    });
  }
};

// Update category
export const updateCategory = async (req: UpdateCategoryRequest, res: Response) => {
  try {
    const categoryData = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Η κατηγορία δεν βρέθηκε' 
      });
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (category.image) {
        await deleteFromCloudinary(category.image);
      }
      const result = await uploadToCloudinary(req.file.path);
      categoryData.image = result.secure_url;
    }

    // Prevent circular parent reference
    if (categoryData.parent && categoryData.parent.toString() === req.params.id) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Μια κατηγορία δεν μπορεί να είναι γονέας του εαυτού της' 
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true }
    )
      .populate('parent', 'name')
      .populate('children', 'name');

    res.json({
      status: 'success',
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση της κατηγορίας' 
    });
  }
};

// Delete category
export const deleteCategory = async (req: DeleteCategoryRequest, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Η κατηγορία δεν βρέθηκε' 
      });
    }

    // Check for child categories
    const childCategories = await Category.find({ parent: req.params.id });
    if (childCategories.length > 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Δεν μπορείτε να διαγράψετε κατηγορία που έχει υποκατηγορίες' 
      });
    }

    // Delete image from Cloudinary if exists
    if (category.image) {
      await deleteFromCloudinary(category.image);
    }

    await category.deleteOne();
    res.json({ 
      status: 'success',
      message: 'Η κατηγορία διαγράφηκε επιτυχώς' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά τη διαγραφή της κατηγορίας' 
    });
  }
};

// Update category order
export const updateOrder = async (req: UpdateOrderRequest, res: Response) => {
  try {
    const { categories } = req.body;

    // Update order for each category
    const updatePromises = categories.map((cat) => 
      Category.findByIdAndUpdate(cat._id, { order: cat.order })
    );

    await Promise.all(updatePromises);
    res.json({ 
      status: 'success',
      message: 'Η σειρά των κατηγοριών ενημερώθηκε επιτυχώς' 
    });
  } catch (error) {
    console.error('Error updating category order:', error);
    res.status(400).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση της σειράς των κατηγοριών' 
    });
  }
};

// Get category tree
export const getCategoryTree = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find({})
      .populate('parent', 'name')
      .sort('order') as CategoryDocument[];

    // Build tree structure
    const tree = categories
      .filter(cat => !cat.parent)
      .map(cat => ({
        ...cat.toObject(),
        children: buildCategoryTree(categories, cat._id.toString())
      }));

    res.json({
      status: 'success',
      data: tree
    });
  } catch (error) {
    console.error('Error getting category tree:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση του δέντρου κατηγοριών' 
    });
  }
};

// Helper function to build category tree
const buildCategoryTree = (categories: CategoryDocument[], parentId: string): CategoryTree[] => {
  return categories
    .filter(cat => cat.parent && cat.parent.toString() === parentId)
    .map(cat => ({
      ...cat.toObject(),
      children: buildCategoryTree(categories, cat._id.toString())
    }));
};
