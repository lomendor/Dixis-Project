import { Request, Response } from 'express';
import { SortOrder } from 'mongoose';
import Product from '../models/Product.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { RequestHandler } from 'express';

interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  category?: string;
  status?: 'active' | 'inactive' | 'outOfStock';
  stock?: number;
}

// Επέκταση του Request type για να συμπεριλάβει τα files
interface RequestWithFiles extends Request {
  files?: Express.Multer.File[];
}

// Get all products with filtering, sorting and pagination
export const getProducts: RequestHandler = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = '-createdAt',
      category,
      producer,
      status,
      search
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (producer) query.producerId = producer;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Μετατροπή του sort string σε αντικείμενο
    const sortObj: { [key: string]: SortOrder } = {};
    if (typeof sort === 'string') {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      sortObj[sortField] = sort.startsWith('-') ? -1 : 1;
    }

    const products = await Product.find(query)
      .sort(sortObj)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('producerId', 'name');

    const count = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Σφάλμα κατά την ανάκτηση προϊόντων' });
  }
};

// Get single product
export const getProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('producerId', 'name');
    
    if (!product) {
      res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε' });
      return;
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Σφάλμα κατά την ανάκτηση προϊόντος' });
  }
};

// Create new product
export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData: ProductData = req.body;
    const uploadedFiles = (req as any).files;
    
    // Handle image uploads
    if (uploadedFiles && Array.isArray(uploadedFiles)) {
      const imageUrls: string[] = [];
      for (const file of uploadedFiles) {
        const result = await uploadToCloudinary(file.path);
        if (result?.secure_url) {
          imageUrls.push(result.secure_url);
        }
      }
      productData.images = imageUrls;
    }

    const product = new Product(productData);
    await product.save();
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Σφάλμα κατά τη δημιουργία προϊόντος' });
  }
};

// Update product
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const productData: ProductData = req.body;
    const uploadedFiles = (req as any).files;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε' });
      return;
    }

    // Handle image uploads
    if (uploadedFiles && Array.isArray(uploadedFiles)) {
      // Delete old images from Cloudinary
      if (product.images?.length) {
        for (const imageUrl of product.images) {
          await deleteFromCloudinary(imageUrl);
        }
      }

      // Upload new images
      const imageUrls: string[] = [];
      for (const file of uploadedFiles) {
        const result = await uploadToCloudinary(file.path);
        if (result?.secure_url) {
          imageUrls.push(result.secure_url);
        }
      }
      productData.images = imageUrls;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    ).populate('producerId', 'name');

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Σφάλμα κατά την ενημέρωση προϊόντος' });
  }
};

// Delete product
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε' });
      return;
    }

    // Delete images from Cloudinary
    if (product.images?.length) {
      for (const imageUrl of product.images) {
        await deleteFromCloudinary(imageUrl);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Το προϊόν διαγράφηκε επιτυχώς' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Σφάλμα κατά τη διαγραφή προϊόντος' });
  }
};

// Update product stock
export const updateStock: RequestHandler = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Το προϊόν δεν βρέθηκε' });
      return;
    }

    product.stock = stock;
    if (stock === 0) {
      product.status = 'outOfStock';
    }

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Σφάλμα κατά την ενημέρωση αποθέματος' });
  }
};

// Bulk update products
export const bulkUpdateProducts: RequestHandler = async (req, res) => {
  try {
    const { products } = req.body;
    
    const updatePromises = products.map(async (product: any) => {
      return Product.findByIdAndUpdate(
        product._id,
        { $set: product },
        { new: true }
      );
    });

    const updatedProducts = await Promise.all(updatePromises);

    res.status(200).json({
      status: 'success',
      data: updatedProducts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Σφάλμα κατά την μαζική ενημέρωση προϊόντων'
    });
  }
};

// Import products from CSV/Excel
export const importProducts: RequestHandler = async (req, res) => {
  try {
    const { products } = req.body;
    
    const createdProducts = await Product.insertMany(products);

    res.status(201).json({
      status: 'success',
      data: createdProducts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Σφάλμα κατά την εισαγωγή προϊόντων'
    });
  }
}; 