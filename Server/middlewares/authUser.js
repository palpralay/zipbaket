import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    console.log("🔍 Auth User Middleware - All cookies:", req.cookies);
    const { token } = req.cookies;

    if (!token) {
      console.log("❌ No user token found in cookies");
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated - No token provided" 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified for user:", decoded.id);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

    // Attach user ID to request
    req.userId = decoded.id;
    
    // Only set userId in body if body exists (not for GET requests)
    if (req.body && typeof req.body === 'object') {
      req.body.userId = decoded.id;
    }

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