import User from "../models/user.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItem } = req.body;
    await User.findByIdAndUpdate(userId, { cartItem });
    res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
