import { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";

const Cart = () => {
  const [showAddress, setShowAddress] = useState(false);
  const {
    getCartTotal,
    getCartCount,
    products,
    cartItems,
    currency,
    updatecartItem,
    navigate,
    user,
    setCartItems,
  } = useAppContext();
  const [cartArray, setCartArray] = useState([]);
  const [address, setAddress] = useState([]);
  const [selectAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const { axios } = useAppContext();

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/");
      toast.error("Please login to view cart");
    }
  }, [user, navigate]);

  const getUserAddress = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses && data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [axios]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user, getUserAddress]);

  const getCart = useCallback(() => {
    let tempArray = [];
    for (const key in cartItems) {
      const productItem = products.find((item) => item._id === key);
      if (productItem) {
        const itemWithQuantity = { ...productItem, quantity: cartItems[key] };
        tempArray.push(itemWithQuantity);
      }
    }
    setCartArray(tempArray);
  }, [cartItems, products]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems, getCart]);

  // Calculate tax (2%)
  const getTax = () => {
    return getCartTotal() * 0.02;
  };

  // Calculate total
  const getTotal = () => {
    return getCartTotal() + getTax();
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updatecartItem(productId, parseInt(newQuantity));
  };

  const handleRemoveItem = (productId) => {
    updatecartItem(productId, 0);
  };

  const handlePlaceOrder = async () => {
    if (!selectAddress) {
      toast.error("Please select a delivery address");
      return;
    }
    try {
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/orders/cod", {
          userId: user._id,
          items: cartArray.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          address: selectAddress._id,
        });
        if (data.success) {
          toast.success("Order placed successfully!");
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Empty cart state
  if (!products?.length || !cartItems || Object.keys(cartItems).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 mb-24">
        <img
          src={assets.cart_icon}
          alt="empty cart"
          className="w-24 h-24 opacity-50 mb-4"
        />
        <h2 className="text-2xl font-medium text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Add some products to get started!</p>
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-dull transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row mt-16 mb-24 gap-8">
      {/* Cart Items Section */}
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-primary">{getCartCount()} Items</span>
        </h1>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-300">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {/* Cart Items */}
        {cartArray.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-4 border-b border-gray-200 gap-4 md:gap-0"
          >
            {/* Product Info */}
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(
                    `/product/${product.category.toLowerCase()}/${product._id}`
                  );
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-20 h-20 md:w-24 md:h-24 shrink-0 flex items-center justify-center border border-gray-300 rounded overflow-hidden hover:border-primary transition"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0]}
                  alt={product.name}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {product.name}
                </p>
                <div className="font-normal text-gray-500/70 text-xs md:text-sm space-y-1">
                  <p>
                    Weight: <span>{product.weight || "N/A"}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p>Qty:</p>
                    <select
                      className="outline-none border border-gray-300 rounded px-2 py-1 cursor-pointer text-gray-700 bg-white"
                      value={cartItems[product._id] || 1}
                      onChange={(e) =>
                        handleQuantityChange(product._id, e.target.value)
                      }
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-primary font-medium">
                    {currency}
                    {product.offerPrice} each
                  </p>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <p className="text-center font-medium text-gray-800 md:block flex justify-between">
              <span className="md:hidden text-gray-500">Subtotal:</span>
              <span>
                {currency}
                {(product.offerPrice * product.quantity).toFixed(2)}
              </span>
            </p>

            {/* Remove Button */}
            <div className="flex justify-center md:justify-center">
              <button
                onClick={() => handleRemoveItem(product._id)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 transition px-3 py-1.5 rounded hover:bg-red-50"
                title="Remove from cart"
              >
                <img
                  src={assets.remove_icon}
                  alt="remove"
                  className="w-5 h-5 md:w-5 md:h-5"
                />
                <span className="md:hidden text-sm">Remove</span>
              </button>
            </div>
          </div>
        ))}

        {/* Continue Shopping Button */}
        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium hover:gap-3 transition-all"
        >
          <img
            className="group-hover:-translate-x-1 transition transform rotate-180"
            src={assets.arrow_right_icon_colored}
            alt="arrow"
          />
          Continue Shopping
        </button>
      </div>

      {/* Order Summary Section */}
      <div className="md:sticky md:top-4 self-start max-w-[400px] w-full bg-gray-50 p-6 border border-gray-300/70 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <hr className="border-gray-300 mb-5" />

        {/* Delivery Address */}
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase mb-2 text-gray-700">
            Delivery Address
          </p>
          <div className="relative">
            <div className="flex justify-between items-start gap-2">
              <p className="text-gray-600 text-sm flex-1">
                {selectAddress
                  ? `${selectAddress.streetAddress}, ${selectAddress.city}, ${selectAddress.state}, ${selectAddress.country}`
                  : "No address selected"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="text-primary hover:underline cursor-pointer text-sm font-medium shrink-0"
              >
                Change
              </button>
            </div>

            {/* Address Dropdown */}
            {showAddress && (
              <div className="absolute top-8 left-0 right-0 z-10 py-1 bg-white border border-gray-300 rounded shadow-lg text-sm max-h-60 overflow-y-auto">
                {address && address.length > 0 ? (
                  address.map((addr, index) => (
                    <p
                      key={index}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddress(false);
                      }}
                      className="text-gray-600 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      {addr.streetAddress}, {addr.city}, {addr.state}, {addr.country}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 p-3">No saved addresses</p>
                )}
                <p
                  onClick={() => {
                    setShowAddress(false);
                    navigate("/add-address");
                  }}
                  className="text-primary text-center cursor-pointer p-3 hover:bg-primary/10 border-t border-gray-200 font-medium"
                >
                  + Add New Address
                </p>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <p className="text-sm font-semibold uppercase mt-6 mb-2 text-gray-700">
            Payment Method
          </p>
          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2.5 rounded outline-none cursor-pointer focus:border-primary transition text-gray-700"
            value={paymentOption}
          >
            <option value="COD">Cash On Delivery</option>
            <option value="online">Online Payment</option>
          </select>
        </div>

        <hr className="border-gray-300 mb-4" />

        {/* Price Breakdown */}
        <div className="text-gray-600 space-y-3 text-sm">
          <p className="flex justify-between">
            <span>Subtotal ({getCartCount()} items)</span>
            <span className="font-medium text-gray-800">
              {currency}
              {getCartTotal().toFixed(2)}
            </span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600 font-medium">Free</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span className="font-medium text-gray-800">
              {currency}
              {getTax().toFixed(2)}
            </span>
          </p>
          <hr className="border-gray-300" />
          <p className="flex justify-between text-lg font-semibold text-gray-800 pt-2">
            <span>Total Amount:</span>
            <span className="text-primary">
              {currency}
              {getTotal().toFixed(2)}
            </span>
          </p>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium rounded-lg hover:bg-primary-dull transition-all shadow-sm hover:shadow-md"
        >
          {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By placing your order, you agree to our terms and conditions
        </p>
      </div>
    </div>
  );
};

export default Cart;