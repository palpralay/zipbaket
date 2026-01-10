import React, { useEffect } from "react";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import axios from "../utils/axios";

const Myorders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, user } = useAppContext();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        console.log("📦 Fetching orders for user:", user);
        console.log("🔍 DEBUG: Document cookies:", document.cookie);
        
        const { data } = await axios.get("/api/orders/user");
        console.log("✅ Orders fetched successfully:", data);
        
        if (data.success) {
          setMyOrders(data.orders);
        } else {
          console.warn("⚠️ Failed to fetch orders:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        
        if (error.response?.status === 401) {
          console.error("🔒 Authentication error - user needs to login");
        }
      }
    };

    if (user) {
      console.log("📍 User authenticated, fetching orders...");
      fetchMyOrders();
    } else {
      console.warn("⚠️ No user found, skipping orders fetch");
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16 px-4">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-3xl font-semibold uppercase tracking-wide">
          My Orders
        </p>
        <div className="w-full h-1 bg-primary rounded-full mt-1"></div>
      </div>

      {!myOrders || myOrders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">No orders found</p>
          <p className="text-sm text-gray-400 mt-2">Start shopping to see your orders here!</p>
        </div>
      ) : (
        myOrders.map((order, idx) => (
          <div
            key={idx}
            className="border border-gray-300 rounded-xl mb-10 p-5 shadow-sm hover:shadow-md transition max-w-4xl bg-white"
          >
            {/* Top section */}
            <p className="flex justify-between md:items-center text-gray-500 md:font-medium max-md:flex-col gap-2 mb-4">
              <span>
                OrderId:{" "}
                <span className="font-3xl text-gray-500">{order._id}</span>
              </span>
              <span>
                Payment:{" "}
                <span className="font-semibold text-gray-700">
                  {order.paymentType}
                </span>
              </span>
              <span>
                Total Amount:{" "}
                <span className="text-primary font-semibold">
                  {currency}
                  {order.amount}
                </span>
              </span>
            </p>

            {/* Items */}
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => {
                const product = item.product || item.productId;
                
                if (!product) {
                  console.error("Missing product data for item:", item);
                  return null;
                }

                return (
                  <div key={index} className="border-t border-gray-200 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Image & Name */}
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg w-20 h-20 flex items-center justify-center">
                          <img
                            src={product.image?.[0] || "/placeholder.png"}
                            alt={product.name || "Product"}
                            className="w-16 h-16 object-contain"
                          />
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold text-gray-800">
                            {product.name || "Product Name"}
                          </h2>
                          <p className="text-gray-600 text-sm">
                            Category: {product.category || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-col md:items-end gap-1 text-gray-700">
                        <p className="text-sm">
                          Quantity:{" "}
                          <span className="font-semibold">
                            {item.quantity || "1"}
                          </span>
                        </p>

                        <p className="text-sm">
                          Status:{" "}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Order Placed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Delivered"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>

                        <p className="text-sm">
                          Date:{" "}
                          <span className="font-medium">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </p>

                        <p className="text-primary text-base font-semibold mt-1">
                          Amount: {currency}{" "}
                          {((product.offerPrice || product.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>

                        <button className="mt-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No items in this order</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Myorders;
