import { cloudinary } from "../configs/cloudinary.js";
import Product from "../models/product.js";
import Category from "../models/addCategory.js";

export const addProduct = async (req, res) => {
      try {
        let productData = req.body.productData;
        productData = JSON.parse(productData);
        const images = req.files;
        
        if (!images || images.length === 0) {
            return res.status(400).json({ success: false, message: "Please upload at least one image" });
        }
        
        let imageURl = await Promise.all(
            images.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );
        const product = await Product.create({...productData, images: imageURl});
        res.status(201).json({ success: true, message: "Product added successfully", product });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
      }
}

export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
    
}

export const productById = async (req, res) => {
     try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
     } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
     }
    
}

export const changeStock = async (req, res) => {
     try {
        const { id } = req.params;
        const { inStock } = req.body;
        const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
     } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
     }
    
}

export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: "Category already exists" });
        }

        let imageUrl = "";
        if (image) {
            const result = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
                folder: "categories"
            });
            imageUrl = result.secure_url;
        }

        const newCategory = await Category.create({
            name,
            image: imageUrl
        });

        res.status(201).json({ success: true, category: newCategory });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}