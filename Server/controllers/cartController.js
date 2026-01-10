import User from "../models/user.js";

// Update cart
export const updateCart = async (req, res) => {
  try {
    console.log("🛒 Update Cart Request:");
    console.log("  - User ID from middleware:", req.userId);
    console.log("  - Request body:", req.body);
    
    const userId = req.userId || req.body.userId;
    const { cartItem } = req.body;

    if (!userId) {
      console.log("❌ No user ID found");
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    if (!cartItem || typeof cartItem !== 'object') {
      console.log("❌ Invalid cart data");
      return res.status(400).json({ 
        success: false, 
        message: "Valid cart data is required" 
      });
    }

    console.log(`📦 Updating cart for user ${userId}:`, cartItem);
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { cartItem },
      { new: true }
    );

    if (!user) {
      console.log("❌ User not found:", userId);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("✅ Cart updated successfully for:", user.email);

    res.json({ 
      success: true, 
      message: "Cart updated successfully",
      cartItem: user.cartItem 
    });
  } catch (error) {
    console.error("❌ Update cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    const user = await User.findById(userId).select('cartItem');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      cartItem: user.cartItem || {} 
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { cartItem: {} },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Cart cleared successfully" 
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};