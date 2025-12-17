import Order from "../models/Order.js";
import Product from "../models/product.js";

export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!userId || !items || items.length === 0 || !address) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    let amount = await items.reduce(async (acc, item) => {
      const accValue = await acc;
      const product = await Product.findById(item.productId);
      return accValue + product.price * item.quantity;
    }, 0);
    //tax 2%
    amount = amount + amount * 0.02;
    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Cash on Delivery",
      isPaid: false,
    });
    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//get orders by user
export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await Order.find({ userId,
            $or:[{paymentType: "Cash on Delivery"}, {isPaid: true}]
         }).populate('items.product address').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


//get all orders(seller admin)

export const getAllOrders = async (req, res) => {
     try {
       
        const orders = await Order.find({ 
            $or:[{paymentType: "Cash on Delivery"}, {isPaid: true}]
         }).populate('items.product address').sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
