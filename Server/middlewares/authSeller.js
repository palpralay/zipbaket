import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const sellerToken = req.cookies?.sellerToken;

    if (!sellerToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);

    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized seller" });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid seller token" });
  }
};

export default authSeller;
