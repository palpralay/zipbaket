import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const sellerToken = req.cookies?.sellerToken;

    if (!sellerToken) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized - No seller token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (!decoded || !decoded.email) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid seller token" 
      });
    }

    // Check if the email matches the seller email from env
    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized seller" 
      });
    }

    // Attach seller info to request
    req.sellerEmail = decoded.email;

    next();
  } catch (error) {
    console.error("Seller auth middleware error:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid seller token" 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Seller token expired" 
      });
    }

    return res.status(401).json({ 
      success: false, 
      message: error.message || "Seller authentication failed" 
    });
  }
};

export default authSeller;