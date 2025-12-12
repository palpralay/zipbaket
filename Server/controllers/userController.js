import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config';

//register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, //prevent javascript to access the cookie
      secure: process.env.NODE_ENV === "production", //cookie only sent over https
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: 7 days
    });

    return res.status(201).json({
        success: true,
        user: {
            email: user.email,
            name: user.name,
            id: user._id
        }
    })
   
  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
