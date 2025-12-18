import jwt from "jsonwebtoken";
import axios from "../../utils/axios"; 

export const sellerLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const sellerToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("sellerToken", sellerToken, {
        httpOnly: true,
        secure: false, // ✅ FORCE false in dev
        sameSite: "lax", // ✅ FORCE lax in dev
        path: "/", // ✅ VERY IMPORTANT
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ success: true, message: "Seller logged in successfully" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid seller credentials" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error during login" });
  }
};

export const sellerLogout = (req, res) => {
  res.clearCookie("sellerToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res
    .status(200)
    .json({ success: true, message: "Seller logged out successfully" });
};

export const isSellerAuth = async (req, res) => {
  try {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
      return res.status(401).json({ success: false });
    }

    jwt.verify(sellerToken, process.env.JWT_SECRET);
    res.json({ success: true });
  } catch (error) {
    res.status(401).json({ success: false });
  }
};
