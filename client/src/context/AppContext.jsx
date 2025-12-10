import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { dummyProducts } from "../assets/assets";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (itemId) => {
    let cardData = structuredClone(cartItems);
    if (cardData[itemId]) {
      cardData[itemId] += 1;
    } else {
      cardData[itemId] = 1;
    }
    setCartItems(cardData);
    toast.success("Product added to cart");
  };

  // FIXED: Now handles quantity = 0 to remove item
  const updatecartItem = (itemId, quantity) => {
    let cardData = structuredClone(cartItems);
    
    // If quantity is 0 or negative, remove the item completely
    if (quantity <= 0) {
      delete cardData[itemId];
      setCartItems(cardData);
      toast.success("Product removed from cart");
      return;
    }
    
    // Otherwise, update the quantity
    cardData[itemId] = quantity;
    setCartItems(cardData);
    toast.success("Cart updated");
  };

  const removeCartItem = (itemId) => {
    let cardData = structuredClone(cartItems);
    if (cardData[itemId]) {
      cardData[itemId] -= 1;
      if (cardData[itemId] === 0) {
        delete cardData[itemId];
      }
    }
    setCartItems(cardData);
    toast.success("Product removed from cart");
  };

  // Get cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  // FIXED: Now calculates correctly using offerPrice only
  const getCartTotal = () => {
    let total = 0;
    for (const item in cartItems) {
      const itemInfo = products.find((p) => p._id === item);
      
      // Check if product exists and has valid quantity
      if (itemInfo && cartItems[item] > 0) {
        // Use offerPrice if available, otherwise use regular price
        const price = itemInfo.offerPrice || itemInfo.price;
        total += price * cartItems[item];
      }
    }
    return Math.floor(total * 100) / 100;
  };

  const value = {
    user,
    setUser,
    isSeller,
    setSeller,
    showUserLogin,
    setShowUserLogin,
    navigate,
    products,
    setProducts,
    fetchProducts,
    currency,
    cartItems,
    setCartItems,
    addToCart,
    updatecartItem,
    removeCartItem,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartTotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};