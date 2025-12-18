import express from "express";
import { register, login, isAuth, logout } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/isAuth", authUser, isAuth); // ✓ Use authUser middleware
userRoutes.get("/logout", authUser, logout);

export default userRoutes;
