import express from "express";
import authSeller from "../middlewares/authSeller.js";
import { sellerLogin, sellerLogout, isSellerAuth } from "../controllers/sellerController.js";

const sellerRoutes = express.Router();

sellerRoutes.post("/login", sellerLogin);
sellerRoutes.post("/logout", authSeller, sellerLogout);
sellerRoutes.get("/isSellerAuth", authSeller, isSellerAuth);

export default sellerRoutes;