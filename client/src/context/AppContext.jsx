import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import axios from "../utils/axios";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [sellerLoading, setSellerLoading] = useState(true); 
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/api/products/list");
      if(data.success){
        setProducts(data.products);

      }else {
        toast.error("Failed to fetch products");
      }
      
    } catch (error) {
     toast.error("Failed to fetch products: " + (error.response?.data?.message || error.message)); 
    }
  };

  const fetchSeller = async () => {
   try {
    setSellerLoading(true); // ✅ start loading

    const { data } = await axios.get("/api/sellers/isSellerAuth");

    if (data.success) {
      setIsSeller(true);
    } else {
      setIsSeller(false);
    }
  } catch (error) {
    setIsSeller(false);
  } finally {
    setSellerLoading(false); // ✅ done loading
  }
  };

  const fetchUser = async () => {
  try {
    const { data } = await axiosInstance.get("/api/users/isAuth", {
      validateStatus: (status) => status < 500
    });
    if (data.success) {
      setUser(data.user);
      setCartItems(data.user.cartItem || {});
    } else {
      setUser(null);
      setCartItems({});
    }
  } catch (error) {
    setUser(null);
    setCartItems({});
    console.error("Error fetching user status:", error);
  }
};

  useEffect(() => {
  fetchUser();
  fetchSeller();
}, []);

useEffect(() => {
  fetchProducts();
}, []);


  useEffect(() => {
    console.log("Cart Items Updated:", cartItems);
    const updateCartOnServer = async () => {
      if (user) {
        try {
          await axiosInstance.post("/api/users/updateCart", {
            cartItem: cartItems,
          });
        } catch (error) {
          console.error("Failed to update cart on server:", error);
        }
      }
    };
    updateCartOnServer();
  }, [cartItems]);

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
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    navigate,
    products,
    setProducts,
    fetchProducts,
    fetchUser,
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
    sellerLoading,
    axios: axiosInstance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};