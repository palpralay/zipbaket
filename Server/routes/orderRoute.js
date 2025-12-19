import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getOrdersByUser,
  placeOrderCOD,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRoute = express.Router();

// User routes
orderRoute.post("/cod", authUser, placeOrderCOD);
orderRoute.get("/user", authUser, getOrdersByUser);

// Seller routes
orderRoute.get("/seller", authSeller, getAllOrders);
orderRoute.patch("/status/:id", authSeller, updateOrderStatus);

export default orderRoute;