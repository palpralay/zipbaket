import jwt from "jsonwebtoken";

// Seller login
export const sellerLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Check credentials
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
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ 
        success: true, 
        message: "Seller logged in successfully" 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid seller credentials" 
      });
    }
  } catch (error) {
    console.error("Seller login error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Server error during login" 
    });
  }
};

// Seller logout
export const sellerLogout = (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({ 
      success: true, 
      message: "Seller logged out successfully" 
    });
  } catch (error) {
    console.error("Seller logout error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Server error during logout" 
    });
  }
};

// Check seller authentication
export const isSellerAuth = async (req, res) => {
  try {
    const { sellerToken } = req.cookies;

    if (!sellerToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated" 
      });
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email === process.env.SELLER_EMAIL) {
      return res.json({ 
        success: true,
        seller: {
          email: decoded.email
        }
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized seller" 
      });
    }
  } catch (error) {
    console.error("Seller auth check error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};