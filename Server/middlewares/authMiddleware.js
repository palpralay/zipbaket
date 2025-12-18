import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id; // ✓ Set userId for use in controllers
    
    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;