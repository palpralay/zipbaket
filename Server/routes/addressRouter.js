import express from "express";
import authUser from "../middlewares/authUser.js";
import { 
  addAddress, 
  getAddress, 
  getAddressById,
  updateAddress,
  deleteAddress 
} from "../controllers/addressController.js";

const addressRouter = express.Router();

// All routes require authentication
addressRouter.post("/add", authUser, addAddress);
addressRouter.get("/get", authUser, getAddress);
addressRouter.get("/:id", authUser, getAddressById);
addressRouter.put("/:id", authUser, updateAddress);
addressRouter.delete("/:id", authUser, deleteAddress);

export default addressRouter;