import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true 
  },
  items: [{
    productId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1
    }
  }],
  amount: { 
    type: Number, 
    required: true,
    min: 0
  },
  address: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true 
  },
  status: { 
    type: String, 
    default: "Order Placed",
    enum: [
      "Order Placed",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ]
  },
  paymentType: { 
    type: String, 
    required: true,
    enum: ["Cash on Delivery", "Online"]
  },
  isPaid: { 
    type: Boolean, 
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Add indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;