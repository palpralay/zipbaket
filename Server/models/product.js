import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: Array,
      required: [true, "Product description is required"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "Description must have at least one item",
      },
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer price is required"],
      min: [0, "Offer price cannot be negative"],
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Offer price cannot be greater than original price",
      },
    },
    image: {
      type: Array,
      required: [true, "At least one image is required"],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "At least one product image is required",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    weight: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ category: 1, inStock: 1 });
productSchema.index({ name: "text" });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
