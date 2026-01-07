import { cloudinary } from "../configs/cloudinary.js";
import Product from "../models/product.js";
import Category from "../models/addCategory.js";
import fs from "fs";

// Add product
export const addProduct = async (req, res) => {
  try {
    let productData = req.body.productData;
    
    if (!productData) {
      return res.status(400).json({ 
        success: false, 
        message: "Product data is required" 
      });
    }

    productData = JSON.parse(productData);
    const images = req.files;
    
    if (!images || images.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Please upload at least one image" 
      });
    }

    // Upload images to cloudinary
    let imageURLs = await Promise.all(
      images.map(async (file) => {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                resource_type: "image",
                folder: "zipbasket_products"
            });
            
            // Delete local file after successful upload
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path); 
            }
            
            return result.secure_url;
        } catch (uploadError) {
             // Try to delete file even if upload fails
             if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
             }
             throw uploadError;
        }
      })
    );

    // Create product
    const product = await Product.create({
      ...productData,
      image: imageURLs
    });

    res.status(201).json({ 
      success: true, 
      message: "Product added successfully", 
      product 
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get all products
export const productList = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get product by ID
export const productById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Get product by ID error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Update product stock status
export const changeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    if (typeof inStock !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: "inStock must be a boolean value" 
      });
    }

    const product = await Product.findByIdAndUpdate(
      id, 
      { inStock }, 
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Stock status updated successfully",
      product 
    });
  } catch (error) {
    console.error("Change stock error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Add category
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: "Category name is required" 
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ 
        success: false, 
        message: "Category already exists" 
      });
    }

    let imageUrl = "";
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
        folder: "zipbasket_categories"
      });
      imageUrl = result.secure_url;
    }

    const newCategory = await Category.create({
      name,
      image: imageUrl
    });

    res.status(201).json({ 
      success: true, 
      message: "Category added successfully",
      category: newCategory 
    });
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Delete product (for future use)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Delete images from cloudinary
    if (product.image && product.image.length > 0) {
      for (const imageUrl of product.image) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`zipbasket_products/${publicId}`);
      }
    }

    res.status(200).json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Update product (for future use)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let productData = req.body.productData;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Product ID is required" 
      });
    }

    if (productData) {
      productData = JSON.parse(productData);
    }

    const images = req.files;
    let updateData = { ...productData };

    // If new images are uploaded
    if (images && images.length > 0) {
      let imageURLs = await Promise.all(
        images.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "zipbasket_products"
          });
          return result.secure_url;
        })
      );
      updateData.image = imageURLs;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Product updated successfully",
      product 
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};