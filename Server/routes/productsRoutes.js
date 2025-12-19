import express from "express";
import { 
  addProduct, 
  productList, 
  changeStock, 
  productById, 
  addCategory, 
  getCategories,
  deleteProduct,
  updateProduct 
} from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";

const productsRoutes = express.Router();

// Public routes
productsRoutes.get('/list', productList);
productsRoutes.get('/id/:id', productById);
productsRoutes.get('/categories', getCategories);

// Seller protected routes
productsRoutes.post('/add-product', authSeller, upload.array('images', 5), addProduct);
productsRoutes.patch('/stock/:id', authSeller, changeStock);
productsRoutes.post('/add-category', authSeller, upload.single('image'), addCategory);
productsRoutes.delete('/delete/:id', authSeller, deleteProduct);
productsRoutes.put('/update/:id', authSeller, upload.array('images', 5), updateProduct);

export default productsRoutes;