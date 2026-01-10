import Order from "../models/Order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

// Place order with Cash on Delivery
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    // Validation
    if (!userId || !items || items.length === 0 || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Calculate total amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }
      amount += product.offerPrice * item.quantity;
    }

    // Add 2% tax
    amount = amount + (amount * 0.02);
    amount = Math.round(amount * 100) / 100; // Round to 2 decimal places

    // Create order
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Cash on Delivery",
      isPaid: false,
      status: "Order Placed"
    });

    // Clear user's cart after successful order
    await User.findByIdAndUpdate(userId, { cartItem: {} });

    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully", 
      order 
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get orders by user
export const getOrdersByUser = async (req, res) => {
  try {
    console.log("📦 Get Orders Request:");
    console.log("  - User ID from middleware:", req.userId);
    console.log("  - User ID from body:", req.body.userId);
    console.log("  - Request method:", req.method);
    
    const userId = req.userId || req.body.userId;

    if (!userId) {
      console.log("❌ No user ID found");
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    console.log(`🔍 Fetching orders for user: ${userId}`);

    const orders = await Order.find({ 
      userId,
      $or: [
        { paymentType: "Cash on Delivery" }, 
        { isPaid: true }
      ]
    })
    .populate({
      path: 'items.productId',
      select: 'name price offerPrice image category'
    })
    .populate('address')
    .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${orders.length} orders for user`);

    // Transform the data to match frontend expectations
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        _id: item._id
      }))
    }));

    res.status(200).json({ 
      success: true, 
      orders: transformedOrders 
    });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Get all orders (seller/admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      $or: [
        { paymentType: "Cash on Delivery" }, 
        { isPaid: true }
      ]
    })
    .populate({
      path: 'items.productId',
      select: 'name price offerPrice image category'
    })
    .populate('address')
    .sort({ createdAt: -1 });

    // Transform the data to match frontend expectations
    const transformedOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        _id: item._id
      }))
    }));

    res.status(200).json({ 
      success: true, 
      orders: transformedOrders 
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server Error" 
    });
  }
};

// Update order status (for future use)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required"
      });
    }

    const validStatuses = [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status"
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error"
    });
  }
};