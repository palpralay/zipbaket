import express from "express";
import { register, login, isAuth, logout, updateProfile, changePassword } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRoutes = express.Router();

// Public routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);

// Protected routes
userRoutes.get("/isAuth", authUser, isAuth);
userRoutes.post("/logout", authUser, logout);
userRoutes.put("/profile", authUser, updateProfile);
userRoutes.post("/change-password", authUser, changePassword);

export default userRoutes;