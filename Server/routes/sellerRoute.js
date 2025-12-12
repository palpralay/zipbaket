import express from "express";
import authSeller from "../middlewares/authSeller.js";
import { sellerLogin, sellerLogout } from "../controllers/sellerController.js";

const sellerRoutes = express.Router();

sellerRoutes.post("/login", sellerLogin);
sellerRoutes.post("/logout", authSeller, sellerLogout);

export default sellerRoutes;