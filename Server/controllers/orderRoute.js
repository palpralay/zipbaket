import express from "express";
import authUser from "../middlewares/authMiddleware.js";
import {
  getOrdersByUser,
  placeOrderCOD,
  getAllOrders,
} from "./orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRoute = express.Router();

orderRoute.post("/cod", authUser, placeOrderCOD);
orderRoute.get("/user", authSeller, getOrdersByUser);
orderRoute.get("/seller", authSeller, getAllOrders);

export default orderRoute;
