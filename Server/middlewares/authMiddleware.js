//authUser is a middleware that protects backend routes by checking if the user is logged in using a JWT token stored in cookies.

import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    
    next();
  } catch (error) {
    console.error("Error in authUser middleware:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
export default authUser;    
