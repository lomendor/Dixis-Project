const Category = require('../models/Category');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Get all categories with optional parent filter
exports.getCategories = async (req, res) => {
  try {
    const { parent } = req.query;
    const query = parent ? { parent } : { parent: null };

    const categories = await Category.find(query)
      .populate('parent', 'name')
      .populate('children', 'name')
      .sort('order');

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by ID
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name')
      .populate('children', 'name');

    if (!category) {
      return res.status(404).json({ message: 'Η κατηγορία δεν βρέθηκε' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new category
exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body;

    // Handle image upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      categoryData.image = result.secure_url;
    }

    const category = new Category(categoryData);
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Η κατηγορία δεν βρέθηκε' });
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
    if (categoryData.parent === req.params.id) {
      return res.status(400).json({ 
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

    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Η κατηγορία δεν βρέθηκε' });
    }

    // Check for child categories
    const childCategories = await Category.find({ parent: req.params.id });
    if (childCategories.length > 0) {
      return res.status(400).json({ 
        message: 'Δεν μπορείτε να διαγράψετε κατηγορία που έχει υποκατηγορίες' 
      });
    }

    // Delete image from Cloudinary if exists
    if (category.image) {
      await deleteFromCloudinary(category.image);
    }

    await category.remove();
    res.json({ message: 'Η κατηγορία διαγράφηκε επιτυχώς' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category order
exports.updateOrder = async (req, res) => {
  try {
    const { categories } = req.body;

    // Update order for each category
    const updatePromises = categories.map((cat) => 
      Category.findByIdAndUpdate(cat._id, { order: cat.order })
    );

    await Promise.all(updatePromises);
    res.json({ message: 'Η σειρά των κατηγοριών ενημερώθηκε επιτυχώς' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get category tree
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate('parent', 'name')
      .sort('order');

    // Build tree structure
    const tree = categories
      .filter(cat => !cat.parent)
      .map(cat => ({
        ...cat.toObject(),
        children: buildCategoryTree(categories, cat._id)
      }));

    res.json(tree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to build category tree
const buildCategoryTree = (categories, parentId) => {
  return categories
    .filter(cat => cat.parent && cat.parent._id.toString() === parentId.toString())
    .map(cat => ({
      ...cat.toObject(),
      children: buildCategoryTree(categories, cat._id)
    }));
}; 