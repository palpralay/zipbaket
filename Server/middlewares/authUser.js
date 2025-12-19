import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated - No token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    // Attach user ID to request
    req.userId = decoded.id;
    req.body.userId = decoded.id; // For compatibility with some controllers

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token expired" 
      });
    }

    return res.status(401).json({ 
      success: false, 
      message: error.message || "Authentication failed" 
    });
  }
};

export default authUser;