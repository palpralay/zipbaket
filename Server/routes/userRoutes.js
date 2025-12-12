import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import { register, login, isAuth, logout } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.get("/isAuth", authUser, isAuth);
userRoutes.get("/logout", authUser, logout);


export default userRoutes;
