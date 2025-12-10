import React from "react";
import Navbar from "./component/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./component/Footer";
import Login from "./component/Login";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import AllProduct from "./pages/AllProduct";
import ProductCategories from "./pages/ProductCategories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";  
import AddAddress from "./pages/AddAddress";
import Myorders from "./pages/Myorders";

const App = () => {
  const isSellerpath = useLocation().pathname.includes("seller");

  const { showUserLogin } = useContext(AppContext);

  return (
    <div className="overflow-y-scroll no-scrollbar">
      <Toaster />

      {isSellerpath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}
      <div
        className={`${isSellerpath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProduct />} />
          <Route path="/category/:category" element={<ProductCategories />} />
          <Route path="/product/:category/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<Myorders />} />
        </Routes>
        {!isSellerpath && <Footer />}
      </div>
    </div>
  );
};

export default App;
