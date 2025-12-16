import express from "express";
import { addProduct, productList, changeStock, productById, addCategory, getCategories } from "../controllers/productController.js";
import { upload } from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";

const productsRoutes = express.Router();

productsRoutes.post('/add-product', authSeller, upload.array('images', 5), addProduct);
productsRoutes.get('/list', productList);
productsRoutes.get('/id/:id', productById);
productsRoutes.patch('/stock/:id', authSeller, changeStock);
productsRoutes.post('/add-category', authSeller, upload.single('image'), addCategory);
productsRoutes.get('/categories', getCategories);

export default productsRoutes;