import express from "express";
import authUser from "../middlewares/authUser.js";
import { updateCart, getCart, clearCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

// All routes require authentication
cartRouter.post('/update', authUser, updateCart);
cartRouter.get('/get', authUser, getCart);
cartRouter.delete('/clear', authUser, clearCart);

export default cartRouter;