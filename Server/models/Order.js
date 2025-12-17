import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true, ref: "prodcut" },
      quantity: { type: Number, required: true },
    }],
    amount: { type: Number, required: true },
    address: { type:String, required: true },
    status: { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
  
});

const Order = mongoose.models.order || mongoose.model("order", orderSchema);
export default Order;
