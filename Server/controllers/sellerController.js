//seller login
import jwt from "jsonwebtoken";

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
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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

//seller logout
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

//seller isAuth
export const isSellerAuth = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "Seller is authenticated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
